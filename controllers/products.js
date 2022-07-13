const Products = require('../models/product');

const getProductsStatic = async (req, res) => {
    const products = await Products.find({})
    res.status(200).json({ products, nbHits: products.length })
};

const getProducts = async (req, res) => {
    const { featured, company } = req.query
    const queryObject = {}

    if(featured) {
        queryObject.featured = featured === 'true'? true : false
    }
    if(company) {
        queryObject.company = company
    }
    const products = await Products.find(queryObject)
    res.status(200).json({ products, nbHits: products.length })
};

module.exports = {
    getProducts,
    getProductsStatic
}