const Products = require('../models/product');

//Función para testear y ejemplificar find sort select limit skip
const getProductsStatic = async (req, res) => {
    const products = await Products
    .find({})
    .sort('name') //Sort y Select llevan espacio entre parametros
    .select('name price') 
    .lmit(10)
    .skip(5) 
    res.status(200).json({ products, nbHits: products.length })
};

//Buscar según categoría, ordenar y seleccionar.
const getProducts = async (req, res) => {
    const { featured, company, name, sort, fields, numericFilters } = req.query
    const queryObject = {}
    //Find
    if (featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    if (company) {
        queryObject.company = company
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' } //$regex es una expresion regular de MongoDB para marchear strings en queries 
    }
    //Numerc Filters
    if(numericFilters) {
        const operatorMap = {
            '>': '$gt',  //Greater than
            '>=': '$gte',  //Greater than equal
            '=': '$eq',  //Equal
            '<': '$lt',  //Lesser than
            '<=': '$lte'  //Lesser than equal
        }
        const regExp = /\b(<|>|=|<=|>=)\b/g //Expresiones regulares
        //Reemplazar las expresiones regulares provistas por el usuario por las que usa mongoose cuando hay un match en el obj operatorMap
        let filters = numericFilters.replace(regExp, (match) => `-operatorMap[match]-`)

        const options = ['price', 'rating'] //Los unicos parametros numéricos
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if(options.includes(field)) {
                queryObject[field] = {[operator]: Number(value)}        //Si existe 'price' o 'rating' entonces se asigna dinamicamente el operador y el valor
                // Pasando por ejemplo ...products?numericFilters=price>40,rating>=10 entonces
                // queryObject devolvería  {price: {'$gt': 40}, rating: {'$gte': 10}}
            }
        })
    }

    //Sort
    let result = Products.find(queryObject)
    if (sort) {
        const sortList = sort.split(',').join(' ') //Se formatea , por espacio
        result = result.sort(sortList)
    }
    else {
        result = result.sort('createdAt') //Por default sortear por Date
    }
    //Select
    if (fields) {
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }
    //Page (Limit and Skip)
    const page = Number(req.query.page) || 1   //req.query.page es string
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1)*limit

    result = result.skip(skip).limit(limit)

    const products = await Products.find(queryObject)
    res.status(200).json({ products, nbHits: products.length })
};

module.exports = {
    getProducts,
    getProductsStatic
}