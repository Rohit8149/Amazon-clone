const express = require("express");
const router = new express.Router();
const jwt = require('jsonwebtoken');
const { Product } = require("../models/productsSchema");
// const {products,initializeDatabase} = require("../models/productsSchema");
// // const Product = require("../models/productsSchema");
const {pool} = require('../db/conn');
const {User} = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const authenicate = require("../middleware/authenticate");

// router.get("/",(req,res)=>{
//     res.send("this is testing routes");
// });


// get the products data

// router.get("/getproducts", async (req, res) => {
//     try {
//         const producstdata = await products.find();
//         console.log(producstdata + "data mila hain");
//         res.status(201).json(producstdata);
//     } catch (error) {
//         console.log("error" + error.message);
//     }
// });
router.get("/getproducts", async (req, res) => {
    try {
        const productsData = await Product.findAll();
        console.log(productsData + " data retrieved");
        res.status(200).json(productsData);
    } catch (error) {
        console.error("Error: " + error.message);
        res.status(500).json({ error: error.message });
    }
});


// register the data
router.post("/register", async (req, res) => {
    const { fname, email, mobile, password, cpassword } = req.body;

    if (!fname || !email || !mobile || !password || !cpassword) {
        return res.status(422).json({ error: "Please fill all the details" });
    }

    try {
        // Check if the user already exists
        const preuser = await User.findOne({ where: { email } });

        if (preuser) {
            return res.status(422).json({ error: "This email already exists" });
        } else if (password !== cpassword) {
            return res.status(422).json({ error: "Passwords do not match" });
        } else {
            // Insert the new user
            const newUser = await User.create({
                fname,
                email,
                mobile,
                password,
                cpassword
            });

            // // Generate token
            // const token = await newUser.generateAuthToken();

            console.log(newUser + " user successfully added");
            res.status(201).json(newUser);
        }
    } catch (error) {
        console.error("Error during registration: " + error.message);
        res.status(500).send(error);
    }
});


// // login data
// login data
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please fill in all fields' });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            console.log(isMatch);

            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid credentials' });
            } else {
                // Generate JWT token
                const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
                user.tokens = [...user.tokens, { token }];
                await user.save();
                console.log(token);

                // Set cookie
                res.cookie('ecommerce', token, {
                    expires: new Date(Date.now() + 2589000),
                    httpOnly: true,
                });

                return res.status(200).json({ message: 'Login successful', user });
            }
        } else {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        return res.status(500).json({ error: 'Server error' });
    }
});

// router.post("/login", async (req, res) => {
//     // console.log(req.body);
//     const { email, password } = req.body;

//     if (!email || !password) {
//         res.status(400).json({ error: "fill the details" });
//     }

//     try {

//         const userlogin = await User.findOne({ email: email });
//         console.log(userlogin);
//         if (userlogin) {
//             const isMatch = await bcrypt.compare(password, userlogin.password);
//             console.log(isMatch);



//             if (!isMatch) {
//                 res.status(400).json({ error: "invalid crediential pass" });
//             } else {
                
//                 const token = await userlogin.generatAuthtoken();
//                 console.log(token);

//                 res.cookie("eccomerce", token, {
//                     expires: new Date(Date.now() + 2589000),
//                     httpOnly: true
//                 });
//                 res.status(201).json(userlogin);
//             }

//         } else {
//             res.status(400).json({ error: "user not exist" });
//         }

//     } catch (error) {
//         res.status(400).json({ error: "invalid crediential pass" });
//         console.log("error the bhai catch ma for login time" + error.message);
//     }
// });

// getindividual

// router.get("/getproductsone/:id", async (req, res) => {

//     try {
//         const { id } = req.params;
//         console.log(id);

//         const individual = await products.findOne({ id: id });
//         console.log(individual + "ind mila hai");

//         res.status(201).json(individual);
//     } catch (error) {
//         res.status(400).json(error);
//     }
// });

router.get("/getproductsone/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);

        const individual = await Product.findOne({ where: { id: id } });
        console.log(individual + " ind mila hai");

        res.status(201).json(individual);
    } catch (error) {
        console.error("Error: " + error.message);
        res.status(400).json({ error: error.message });
    }
});

// adding the data into cart
router.post("/addcart/:id", authenicate, async (req, res) => {

    try {
        console.log("perfect 6");
        const { id } = req.params;
        const cart = await products.findOne({ id: id });
        console.log(cart + "cart milta hain");

        const Usercontact = await User.findOne({ _id: req.userID });
        console.log(Usercontact + "user milta hain");


        if (Usercontact) {
            const cartData = await Usercontact.addcartdata(cart);

            await Usercontact.save();
            console.log(cartData + " thse save wait kr");
            console.log(Usercontact + "userjode save");
            res.status(201).json(Usercontact);
        }
    } catch (error) {
        console.log(error);
    }
});


// get data into the cart
router.get("/cartdetails", authenicate, async (req, res) => {
    try {
        const buyuser = await User.findOne({ _id: req.userID });
        console.log(buyuser + "user hain buy pr");
        res.status(201).json(buyuser);
    } catch (error) {
        console.log(error + "error for buy now");
    }
});



// get user is login or not
router.get("/validuser", authenicate, async (req, res) => {
    try {
        const validuserone = await User.findOne({ _id: req.userID });
        console.log(validuserone + "user hain home k header main pr");
        res.status(201).json(validuserone);
    } catch (error) {
        console.log(error + "error for valid user");
    }
});

// for userlogout

router.get("/logout", authenicate, async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token
        });

        res.clearCookie("eccomerce", { path: "/" });
        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens);
        console.log("user logout");

    } catch (error) {
        console.log(error + "jwt provide then logout");
    }
});

// item remove ho rhi hain lekin api delete use krna batter hoga
// remove iteam from the cart

router.get("/remove/:id", authenicate, async (req, res) => {
    try {
        const { id } = req.params;

        req.rootUser.carts = req.rootUser.carts.filter((curel) => {
            return curel.id != id
        });

        req.rootUser.save();
        res.status(201).json(req.rootUser);
        console.log("iteam remove");

    } catch (error) {
        console.log(error + "jwt provide then remove");
        res.status(400).json(error);
    }
});


module.exports = router;