const express = require("express");
const cors = require("cors");
const path = require("path");
const restaurantRoutes = require("./src/routes/restaurantRoutes");

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api", restaurantRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
