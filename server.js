import express from "express";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const sql = postgres({
  connectionString: process.env.DATABASE_URL,
  ...(process.env.NODE_ENV === "production" ? { ssl: { rejectUnauthorized: false } } : {}),
});

app.use(express.static("static"));
app.use(express.json());

// Create new goals

// See all active goals

// See selected goal by day

// Update goal

// Delete goal

// Catch errors
app.use((req, res, next) => {
  console.error(`File Not Found Error CAUGHT`);
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  if (err) {
    console.error(`Internal Server Error CAUGHT`, err);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`${PORT} activated`);
});
