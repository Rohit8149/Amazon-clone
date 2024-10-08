// const mongoose = require("mongoose");
// const validator = require("validator");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const keysecret = process.env.KEY

// const userSchema = new mongoose.Schema({
//     fname: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         validate(value) {
//             if (!validator.isEmail(value)) {
//                 throw new Error("not valid email address");
//             }
//         }
//     },
//     mobile: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 6
//     },
//     cpassword: {
//         type: String,
//         required: true,
//         minlength: 6
//     },
//     tokens:[
//         {
//             token:{
//                 type:String,
//                 required:true
//             }
//         }
//     ],
//     carts:Array
// });


// // password hasing 
// userSchema.pre("save", async function (next) {
//     if (this.isModified("password")) {
//         this.password = await bcrypt.hash(this.password, 12);
//         this.cpassword = await bcrypt.hash(this.cpassword, 12);
//     }
//     next();
// });

// // generting token
// userSchema.methods.generatAuthtoken = async function(){
//     try {
//         let token = jwt.sign({ _id:this._id},keysecret,{
//             expiresIn:"1d"
//         });
//         this.tokens = this.tokens.concat({token:token});
//         await this.save();
//         return token;

//     } catch (error) {
//         console.log(error);
//     }
// }

// // addto cart data
// userSchema.methods.addcartdata = async function(cart){
//     try {
//         this.carts = this.carts.concat(cart);
//         await this.save();
//         return this.carts;
//     } catch (error) {
//         console.log(error + "bhai cart add time aai error");
//     }
// }



// const User = new mongoose.model("USER", userSchema);

// module.exports = User;




// // carts:Array
// // jo aavi rite carts ne add karso to pn chale other wise je old methods 6 eto use krvij
// // carts:[
// //     {
// //         cart:Object
// //     }
// // ]
// //  this.carts = this.carts.concat({cart}); // to pachi cart ne destructring krine lakhvu
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keysecret = process.env.KEY;

if (!keysecret) {
    console.error('JWT secret key is not defined. Please set the KEY environment variable.');
    process.exit(1);
}

const sequelize = new Sequelize('postgres', 'postgres', 'Rohit123', {
    host: 'localhost',
    dialect: 'postgres',
    port: 4455 // Ensure this is the correct port
});

const User = sequelize.define('User', {
    fname: {
        type: DataTypes.STRING,
        allowNull: false,
        trim: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 100]
        }
    },
    cpassword: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 100]
        }
    },
    tokens: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        defaultValue: []
    },
    carts: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        defaultValue: []
    }
}, {
    tableName: 'users',
    hooks: {
        beforeSave: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 12);
                user.cpassword = await bcrypt.hash(user.cpassword, 12);
            }
        }
    }
});

// Generating token
User.prototype.generateAuthToken = async function() {
    try {
        const token = jwt.sign({ id: this.id }, keysecret, { expiresIn: '1d' });
        this.tokens = [...this.tokens, { token }];
        await this.save();
        return token;
    } catch (error) {
        console.error('Error generating auth token:', error);
        throw new Error('Token generation failed');
    }
};

// Adding cart data
User.prototype.addCartData = async function(cart) {
    try {
        this.carts = [...this.carts, cart];
        await this.save();
        return this.carts;
    } catch (error) {
        console.error("Error adding cart data: ", error);
        throw new Error('Adding cart data failed');
    }
};

const initializeDatabase = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database & tables created!');
    } catch (err) {
        console.error('Error creating database & tables:', err);
    }
};

module.exports = { User, initializeDatabase };
