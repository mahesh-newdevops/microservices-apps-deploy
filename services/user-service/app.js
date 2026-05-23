const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const serviceName = process.env.SERVICE_NAME || "user-service";

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: serviceName });
});

app.get("/api/users", (_req, res) => {
  res.json({
    service: serviceName,
    users: [
      { id: 1, name: "Avery Johnson" },
      { id: 2, name: "Sam Rivera" }
    ]
  });
});

app.listen(port, () => {
  console.log(`${serviceName} listening on port ${port}`);
});

