import "dotenv/config";
import express from "express";
import contactsRouter from "./routes/contactsRouter.js";
import morgan from "morgan";
import "./db.js";
import cors from "cors";
import usersRouter from "./routes/usersRouter.js";
import auth from "./middleware/auth.js";
import path from "node:path";
const app = express();
app.use("/avatars", express.static(path.resolve("public/avatars")));
app.use(morgan("tiny"));

app.use(cors());

app.use(express.json());
app.use("/api", usersRouter);
app.use("/api/contacts", auth, contactsRouter);

// Handle 404 Error
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

// Handle 500 Error
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send("Internal Server Error");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
