
const getProductsStatic = async (req, res) => {
    throw new Error('Testing async errirs')
    res.status(200).json({ msg: 'products testing route' })
};

const getProducts = async (req, res) => {
    res.status(200).json({ msg: 'products route' })
};

module.exports = {
    getProducts,
    getProductsStatic
}