require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require("./routes/authRoutes");
const userParcelRoutes = require("./routes/userParcelRoutes");
const adminParcelRoutes = require("./routes/adminParcelRoutes");
const agentRoutes = require("./routes/agentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");


const app = express();

const corsOptions = {
    origin: [
        'http://localhost:8081',
        'https://cargo-connect-new.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
};
app.use(cors(corsOptions)); 
app.use(cookieParser());
app.use(express.json())

app.use("/api/auth", authRoutes);
app.use("/api/user/parcel", userParcelRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin/parcel", adminParcelRoutes);
app.use("/api/agent", agentRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });