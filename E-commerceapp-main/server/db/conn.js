// const mongoose = require("mongoose");

// const DB = process.env.DATABASE;

// mongoose.connect(DB,{
//     useUnifiedTopology:true,
//     useNewUrlParser:true
// }).then(()=>console.log("connection is successfully done")).catch((error)=>console.log("error hai" + error.message))

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'Rohit123', {
    host: 'localhost',
    dialect: 'postgres',
    port: 4455,
    dialectOptions: {
        ssl: false
    }
});

const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

// Call the connection function to establish the connection
// connection();

module.exports = { connection };
