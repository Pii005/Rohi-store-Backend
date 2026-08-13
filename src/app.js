const express = require("express");
const cors = require("cors");
const app = express();

const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const errorHandler = require("./middlewares/errorHandler");
const orderRoutes = require("./routes/order.routes");

app.use(cors());
app.use(express.json());
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

app.use(errorHandler);

module.exports = app;