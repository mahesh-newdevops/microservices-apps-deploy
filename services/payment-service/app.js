const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const serviceName = process.env.SERVICE_NAME || "payment-service";

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: serviceName });
});

app.get("/api/payments", (_req, res) => {
  res.json({
    service: serviceName,
    payments: [
      { id: "pay_001", orderId: 1001, amount: 49.99, status: "authorized" },
      { id: "pay_002", orderId: 1002, amount: 24.5, status: "captured" }
    ]
  });
});

app.listen(port, () => {
  console.log(`${serviceName} listening on port ${port}`);
});

