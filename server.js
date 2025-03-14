require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const paymentRoutes = require("./routes/paymentRoutes");
const webhookRoutes = require("./routes/webhookRoutes");

const app = express();

connectDB();

app.use("/webhook", webhookRoutes);

app.use(express.json());

app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { key: process.env.STRIPE_PUBLIC_KEY });
});

app.use("/payments", paymentRoutes);

app.get("/success", (req, res) => {
  res.render("success");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
