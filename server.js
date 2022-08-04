import express from "express";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// const sql = postgres(`postgres://localhost:5432/tracker`);

const sql = new postgres({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(express.static("static"));
app.use(express.json());

// User sign-up
app.post("/tracker/users", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  const newUser = await sql`
  INSERT INTO users (username, password)
  VALUES (${username}, ${password}) RETURNING *`;
  res.send(newUser[0]);
});

// User sign-on
app.get("/tracker/users/:username", async (req, res) => {
  const { username } = req.params;
  console.log(username);
  const checkedName = await sql`
  SELECT * FROM users WHERE username = ${username}`;
  console.log(checkedName);
  res.send(checkedName[0]);
});

// Create new goals
app.post("/tracker/goals", async (req, res) => {
  const { title, description, deadline, completed, user_id } = req.body;
  console.log(title, description, deadline, completed, user_id);
  const goal = await sql`
  INSERT INTO goals
    (title, description, deadline, completed, user_id)
  VALUES
    (${title}, ${description}, ${deadline}, ${completed}, ${user_id}) RETURNING *`;
  res.send(goal);
});

// See all active goals
app.get("/tracker/goals", async (req, res) => {
  const goals = await sql`
  SELECT username, title, description, deadline, completed FROM users u INNER JOIN goals g ON u.id = g.user_id`;
  // goals.forEach((item, index, arr) => {
  //   const d = new Date();
  //   item.deadline = item.deadline.toLocaleDateString();
  // });
  res.send(goals);
});

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
