const URL = "https://www.bcv.org.ve/"

import { Agent } from "https"
import axios from "axios"
import * as cheerio from "cheerio"
import { Rate } from "../types/types"

/**
 * Fetches the current exchange rate from a specified URL, processes the HTML response to extract the rate,
 * formats it to a JavaScript float with two decimal places, and returns the rate along with the current date.
 *
 * @returns {Promise<Rate>} An object containing the exchange rate and the current date.
 *
 * @throws Will throw an error if the HTTP request fails or if the rate cannot be parsed.
 */
export async function CrawlerRate(): Promise<Rate> {
    try {
        // create an agent to ignore the SSL certificate
        const agent = new Agent({ rejectUnauthorized: false })

        const response = await axios.get<string>(URL, { httpsAgent: agent })
        const html = response.data

        const doc = cheerio.load(html)

        let rate = doc("#dolar strong").text()
        if (!rate) {
            throw new Error("Rate not found in the HTML response")
        }

        // remove the current format of the rate and replace with javascript float format
        rate = rate.replace(/\./g, '').replace(',', '.')
        // round the rate to 2 decimal places
        const RateNumber = Math.round(parseFloat(rate) * 100) / 100
        if (isNaN(RateNumber)) {
            throw new Error("Parsed rate is not a number")
        }

        // get the current date in the format YYYY-MM-DD
        const date = new Date().toISOString().split("T")[0]
        return { rate: RateNumber, date }
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch the rate: ${error.message}`)
        } else {
            throw new Error("Failed to fetch the rate: Unknown error")
        }
    }
}