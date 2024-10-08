require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 5007;
const cookieParser = require("cookie-parser");
const DefaultData = require("./defaultdata");
const { connection } = require("./db/conn");
// require("./db/conn");
const router = require("./routes/router");
const products = require("./models/productsSchema");
const {initializeDatabase} = require("./models/userSchema")
const jwt = require("jsonwebtoken");
const cors = require("cors");


// middleware
app.use(express.json());
app.use(cookieParser(""));

app.use(cors());

app.use(router);
// app.get("/",(req,res)=>{
//     res.send("your server is running");
// });


if(process.env.NODE_ENV == "production"){
    app.use(express.static("client/build"));
}

app.listen(port,()=>{
    console.log(`your server is running on port ${port} `);
});

connection();

initializeDatabase().then(() => {
    // Seed default data after the connection is established
    DefaultData();
    
});
