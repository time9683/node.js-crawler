import schedule from "node-schedule"
import RateRouter from "./routes/rate"
import logError from "./services/Logger";
import express from "express";
import { initDB, insertRate } from "./services/Ratedb";
import { CrawlerRate } from "./services/crawlerService";
import { setupSwagger } from "./swagger";



const app = express()
const PORT = process.env.PORT || 3000


setupSwagger(app)

// // Initialize the database
initDB()

// // every day at 12:00 pm
// // every 2 minutes
schedule.scheduleJob("*/2 * * * *", async () => {
  console.log("Crawling rate")
  try {
    const rate = await CrawlerRate()
    if (rate) {
      insertRate(rate)
    }
  } catch (e) {
    logError(e as Error)
  }

}
)

// create a route for the rates
app.use("/api/rates", RateRouter)

// handle invalid routes
app.use((_req, res) => {
  res.status(404).json({ error: "Invalid route" })
})


// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})