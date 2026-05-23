const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const serviceName = process.env.SERVICE_NAME || "payment-service";
const orderServiceUrl = process.env.ORDER_SERVICE_URL || "http://order-service";
const notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL || "http://notification-service";

const payments = [
  { id: "pay_001", orderId: 1001, amount: 49.99, status: "authorized" },
  { id: "pay_002", orderId: 1002, amount: 24.5, status: "captured" }
];

app.use(express.json());

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }

  return response.json();
}

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: serviceName });
});

app.get("/api/payments", async (_req, res) => {
  let ordersById = new Map();
  let notificationSummary = null;
  const upstream = {};

  try {
    const orderPayload = await fetchJson(`${orderServiceUrl}/api/orders`);
    ordersById = new Map((orderPayload.orders || []).map((order) => [order.id, order]));
    upstream.orderService = "connected";
  } catch (error) {
    upstream.orderService = "unavailable";
    upstream.orderServiceReason = error.message;
  }

  try {
    const notificationPayload = await fetchJson(`${notificationServiceUrl}/api/notifications`);
    notificationSummary = {
      service: notificationPayload.service,
      count: (notificationPayload.notifications || []).length
    };
    upstream.notificationService = "connected";
  } catch (error) {
    upstream.notificationService = "unavailable";
    upstream.notificationServiceReason = error.message;
  }

  res.json({
    service: serviceName,
    upstream,
    notificationSummary,
    payments: payments.map((payment) => ({
      ...payment,
      order: ordersById.get(payment.orderId) || null
    }))
  });
});

app.listen(port, () => {
  console.log(`${serviceName} listening on port ${port}`);
});
