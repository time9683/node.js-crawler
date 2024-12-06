import { Router } from "express"
import { getLastRate, getRateInRange } from "../services/Ratedb"
import logError from "../services/Logger"
import { isValidDateFormat } from "../utils"

const rateRouter = Router()


/**
 * @swagger
 * /api/rates/current:
 *   get:
 *     summary: Retrieve the current rate
 *     responses:
 *       200:
 *         description: The current rate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rate:
 *                   type: number
 *                   description: The rate value
 *                 date:
 *                   type: string
 *                   format: date
 *                   description: The date of the rate
 *       404:
 *         description: Rate not found
 *       500:
 *         description: Internal server error
 */

rateRouter.get("/current", async (_req, res) => {
  try {
    const rate = await getLastRate()


    if (rate) {
      res.json(rate);
    } else {
      res.status(404).json({ error: "Rate not found" });
    }
  } catch (e) {
    logError(e as Error)
    res.status(500).json({ error: "Internal server error" })
  }


})








/**
 * @swagger
 * /api/rates/history:
 *   get:
 *     summary: Retrieve rates within a date range
 *     parameters:
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: The start date for the rate query in YYYY-MM-DD format
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: The end date for the rate query in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: A list of rates within the specified date range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rate:
 *                     type: number
 *                     description: The rate value
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date of the rate
 *       400:
 *         description: Invalid date format or range
 *       404:
 *         description: Rates not found
 *       500:
 *         description: Internal server error
 */
rateRouter.get("/history", async (req, res) => {


  const { start_date, end_date } = req.query as { start_date?: string, end_date?: string };


  if ( (start_date && !isValidDateFormat(start_date)) || (end_date && !isValidDateFormat(end_date))) {
    res.status(400).json({ error: "Invalid date format" });
    return;
  }



  try {
    const rates = await getRateInRange(start_date, end_date);

    if (rates.length > 0) {
      res.json(rates);
    }
    else {
      res.status(404).json({ error: "Rates not found" });
    }
  } catch (e) {
    logError(e as Error)
    res.status(500).json({ error: "Internal server error" })
  }


})

export default rateRouter