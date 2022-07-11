require('dotenv').config();

const connectDB = require('./db/connect');
const Product = require('./models/product');
const jsonProducts = require('./products.json');

//connect to the DB
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany() //to remove all data before loading new
        await Product.create(jsonProducts)
        console.log('Sucess');
    } catch (error) {
        console.log(error);
    }
}
start()