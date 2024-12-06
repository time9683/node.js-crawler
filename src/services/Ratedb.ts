import sqlite from "sqlite3"
import { Rate } from "../types/types"
import logError from "./Logger"

const db = new sqlite.Database("rates.sqlite")


/**
 * Initializes the database by creating the `rates` table if it does not already exist.
 * The `rates` table contains the following columns:
 * - `id`: An integer primary key that auto-increments.
 * - `rate`: A real number representing the rate.
 * - `date`: A text field representing the date.
 */
export function initDB() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS rates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rate REAL,
            date TEXT
          )`, (err) => {
            if (err) {
                logError(err)
            }
        }
        )
    })
}



/**
 * Inserts a new rate into the database.
 *
 * @param {Rate} rateData - The rate data to be inserted, containing the rate and date.
 */
export function insertRate(rateData: Rate): Promise<void> {
    return new Promise((resolve, reject) => {
    db.serialize(() => {
        const stmt = db.prepare("INSERT INTO rates (rate, date) VALUES (?, ?)")
        stmt.run(rateData.rate, rateData.date)
        stmt.finalize((err) => {
            if (err) {
                reject(err)
            }
            resolve()   
         })
})
})
}


/**
 * Retrieves the most recent rate from the database.
 *
 * @returns {Promise<Rate|undefined>} - A promise that resolves to the most recent Rate object, or undefined if no rates are found.
 * @throws Will throw an error if there is an issue querying the database.
 */
export function getLastRate(): Promise<Rate | undefined> {
    return new Promise((resolve, reject) => {
        db.get("SELECT rate,date FROM rates ORDER BY id DESC LIMIT 1", (err, row) => {
            if (err) {
                reject(err)
            }
            resolve(row as Rate)
        })
    })
}

/**
 * Retrieves rates within a specified date range from the database.
 *
 * @param {string} [startDate] - The start date of the range in 'YYYY-MM-DD' format. If not provided, no lower bound is applied.
 * @param {string} [endDate] - The end date of the range in 'YYYY-MM-DD' format. If not provided, no upper bound is applied.
 * @returns {Promise<Rate[]>} - A promise that resolves to an array of Rate objects within the specified date range.
 * @throws {Error} - If there is an error executing the database query.
 */
export function getRateInRange(startDate?: string, endDate?: string): Promise<Rate[]> {

    return new Promise((resolve, reject) => {
        let query = "SELECT rate,date FROM rates WHERE 1 = 1"
        const params: string[] = [];

        if (startDate) {
            query += " AND date >= ?"
            params.push(startDate)
        }

        if (endDate) {
            query += " AND date <= ?"
            params.push(endDate)
        }


        query += " ORDER BY date DESC"


        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows as Rate[])
            }
        })

    })
}