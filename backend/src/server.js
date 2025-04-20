const express = require("express");
const app = express();
const port = 3000;

const OrderRoutes = require("./routes/order.route");

app.use(express.json());

app.use('/order', OrderRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend service is operational.",
    serviceName: "PhufaCafeAPI",
    timestamp: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`Backend service listening on port ${port}`);
});

module.exports = app;