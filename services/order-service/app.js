const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const serviceName = process.env.SERVICE_NAME || "order-service";
const userServiceUrl = process.env.USER_SERVICE_URL || "http://user-service";

const orders = [
  { id: 1001, userId: 1, total: 49.99, status: "created" },
  { id: 1002, userId: 2, total: 24.5, status: "paid" }
];

app.use(express.json());

async function getUsersById() {
  const response = await fetch(`${userServiceUrl}/api/users`);

  if (!response.ok) {
    throw new Error(`user-service returned ${response.status}`);
  }

  const payload = await response.json();
  return new Map((payload.users || []).map((user) => [user.id, user]));
}

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: serviceName });
});

app.get("/api/orders", async (_req, res) => {
  let usersById = new Map();
  let upstream = { userService: "connected" };

  try {
    usersById = await getUsersById();
  } catch (error) {
    upstream = { userService: "unavailable", reason: error.message };
  }

  res.json({
    service: serviceName,
    upstream,
    orders: orders.map((order) => ({
      ...order,
      user: usersById.get(order.userId) || null
    }))
  });
});

app.listen(port, () => {
  console.log(`${serviceName} listening on port ${port}`);
});
