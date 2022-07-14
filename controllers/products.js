const Products = require('../models/product');

//Función para testear y ejemplificar find sort select
const getProductsStatic = async (req, res) => {
    const products = await Products.find({}).sort('name price') //Sort lleva espacio entre parametros
    res.status(200).json({ products, nbHits: products.length })
};

//Buscar según categoría, ordenar y seleccionar.
const getProducts = async (req, res) => {
    const { featured, company, name, sort, fields } = req.query
    const queryObject = {}
    //Find
    if(featured) {
        queryObject.featured = featured === 'true'? true : false
    }
    if(company) {
        queryObject.company = company 
    }
    if(name) {
        queryObject.name = { $regex: name, $options: 'i'}
    }
    //Sort
    let result = Products.find(queryObject)
    if(sort) {
        const sortList = sort.split(',').join(' ') //Se formatea , por espacio
        result = result.sort(sortList)
    }
    else {
        result = result.sort('createdAt') //Por default sortear por Date
    }
    //Select
    if(fields) {
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }
    const products = await Products.find(queryObject)
    res.status(200).json({ products, nbHits: products.length })
};

module.exports = {
    getProducts,
    getProductsStatic
}