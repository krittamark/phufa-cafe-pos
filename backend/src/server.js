const express = require("express");
const dotenv = require("dotenv");

dotenv.config({path: '.env'});

const app = express();
const port = 3000;

const menuRoutes = require("./routes/menu.route");

app.use(express.json());

app.use('/menu', menuRoutes);

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
