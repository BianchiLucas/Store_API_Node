require('dotenv').config();
require('express-async-errors');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');
const connectDB = require('./db/connect');
const productsRouter = require('./routes/products');

//async errors

const express = require('express');
const app = express();

//middlewares
app.use(express.json())

//routes
app.get('/', (req, res) => {
    res.send('<h1>API Products</h1><a href="/api/v1/products">PRODUCTS</a>')
});

app.use('/api/v1/products', productsRouter);

//products route

app.use(notFoundMiddleware);
app.use(errorHandler);


const port = process.env.PORT || 3000;

const start = async () => {
    try {
        //conectDB
        await connectDB(process.env.MONGO_URI)
        //listen port
        app.listen(port, console.log('Server listening'))
    } catch (error) {
        console.log(error);
    }
};

start();
