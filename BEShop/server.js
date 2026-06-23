console.log(">> BACKEND STARTUP: server.js is starting...");
const express = require('express');
const app = express();

const configViewEngine = require('./config/viewconfig');
const ProductRoutes = require('./routes/product.route');
const UserRoutes = require('./routes/user.route');
const CartRoutes = require('./routes/cart.route');
const OrderRoutes = require('./routes/order.route');
const FeelBackRoutes = require('./routes/feedback.route');
const cors = require('cors');
configViewEngine(app);  
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', ProductRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/cart', CartRoutes);
app.use('/api/orders',OrderRoutes);
app.use('/api/feelback',FeelBackRoutes);
const PORT = process.env.PORT || 3001;
console.log(`>> BACKEND STARTUP: Attempting to listen on port ${PORT}...`);
app.listen(PORT, () => {
    console.log(`>> BACKEND STARTUP: Server is successfully running and listening on port ${PORT}`);
});
