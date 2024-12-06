import { initDB, insertRate } from "../services/Ratedb"
import { Rate } from "../types/types"


const rates: Rate[] = [];
for (let i = 0; i < 50; i++) {
  const date = new Date(2024, 1, 1);
  date.setDate(date.getDate() + i);
  rates.push({
    date: date.toISOString().split('T')[0],
    rate: Math.round(((i + 1) + (Math.random() * 0.99)) * 100) / 100 
  });
}

async function fakeData() {
  
  initDB()

  for (const rate of rates) {
    await insertRate(rate)
  }
  console.log("Fake data inserted")
}

fakeData()