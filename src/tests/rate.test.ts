import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import rateRouter from '../routes/rate';
import * as Ratedb from '../services/Ratedb';
import { isValidDateFormat } from '../utils';
import { Rate } from '../types/types';

const app = express();
app.use('/rate', rateRouter);

vi.mock('../services/Ratedb');
vi.mock('../services/Logger');
vi.mock('../utils');

describe('Rate Router', () => {
  describe('GET /rate/current', () => {
    it('should return the current rate when available', async () => {
      const mockRate: Rate = { rate: 1.23, date: '2023-10-01' };
      vi.spyOn(Ratedb, 'getLastRate').mockResolvedValue(mockRate);

      const response = await request(app).get('/rate/current');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRate);
    });

    it('should return 500 if there is a database error', async () => {
      vi.spyOn(Ratedb, 'getLastRate').mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/rate/current');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });

    it('should return 404 if no rate is found', async () => {
      vi.spyOn(Ratedb, 'getLastRate').mockResolvedValue(undefined);

      const response = await request(app).get('/rate/current');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Rate not found' });
    });
  });

  describe('GET /rate/history', () => {
    it('should return the rate history for a valid date range', async () => {
      const mockRates = [
        { rate: 1.23, date: '2023-10-01' },
        { rate: 1.24, date: '2023-10-02' },
      ];
      vi.spyOn(Ratedb, 'getRateInRange').mockResolvedValue(mockRates);
      (isValidDateFormat as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);

      const response = await request(app).get('/rate/history?start_date=2023-10-01&end_date=2023-10-02');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRates);
    });

    it('should return 400 if the date format is invalid', async () => {
      (isValidDateFormat as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false);

      const response = await request(app).get('/rate/history?start_date=invalid-date');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid date format' });
    });

    it('should return 500 if there is a database error', async () => {
      vi.spyOn(Ratedb, 'getRateInRange').mockRejectedValue(new Error('Database error'));
      (isValidDateFormat as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);

      const response = await request(app).get('/rate/history?start_date=2023-10-01&end_date=2023-10-02');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });

    it('should return 404 if no rates are found in the given range', async () => {
      vi.spyOn(Ratedb, 'getRateInRange').mockResolvedValue([]);
      (isValidDateFormat as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);

      const response = await request(app).get('/rate/history?start_date=2023-10-01&end_date=2023-10-02');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Rates not found' });
    });
  });
});