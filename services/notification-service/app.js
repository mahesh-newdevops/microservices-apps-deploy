const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const serviceName = process.env.SERVICE_NAME || "notification-service";

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: serviceName });
});

app.get("/api/notifications", (_req, res) => {
  res.json({
    service: serviceName,
    notifications: [
      { id: "ntf_001", userId: 1, channel: "email", status: "sent" },
      { id: "ntf_002", userId: 2, channel: "sms", status: "queued" }
    ]
  });
});

app.listen(port, () => {
  console.log(`${serviceName} listening on port ${port}`);
});
