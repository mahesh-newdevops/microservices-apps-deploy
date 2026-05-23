const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const serviceName = process.env.SERVICE_NAME || "order-service";

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: serviceName });
});

app.get("/api/orders", (_req, res) => {
  res.json({
    service: serviceName,
    orders: [
      { id: 1001, userId: 1, total: 49.99, status: "created" },
      { id: 1002, userId: 2, total: 24.5, status: "paid" }
    ]
  });
});

app.listen(port, () => {
  console.log(`${serviceName} listening on port ${port}`);
});

