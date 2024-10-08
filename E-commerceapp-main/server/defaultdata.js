// const productdata = require("./constant/productsdata");
// const Products = require("./models/productsSchema");

// const DefaultData = async()=>{
//     try {
//         await Products.deleteMany({});
//         const storeData = await Products.insertMany(productdata);
//         console.log(storeData);
//     } catch (error) {
//         console.log("error" + error.message);
//     }
// };

// module.exports = DefaultData;

const productdata = require("./constant/productsdata");
const { Product, initializeDatabase } = require("./models/productsSchema"); // Adjust the path as necessary

const DefaultData = async () => {
    try {
        // Ensure the database and tables are initialized
        await initializeDatabase();

        // Delete all existing records
        await Product.destroy({ where: {}, truncate: true });

        // Insert new records
        const storeData = await Product.bulkCreate(productdata);
        console.log('Products have been inserted successfully:', storeData);
    } catch (error) {
        console.error("Error inserting products:", error);
    }
};

module.exports = DefaultData;



