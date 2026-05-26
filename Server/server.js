import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware, requireAuth } from '@clerk/express'
// Creating App using Express
const app = express();

// Middleware
app.use(cors());
// All request will be pass using the cors package
app.use(express.json());
// All request will be pass using this json()
app.use(clerkMiddleware())

// Route
app.get("/", (req, res) => res.send("Server is Live"));
app.get(requireAuth())
const PORT = process.env.PORT || 3000;

// To start this App
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
