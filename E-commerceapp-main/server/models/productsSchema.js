const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres', 'postgres', 'Rohit123', {
    host: 'localhost',
    dialect: 'postgres',
    port: 4455 // Ensure this is the correct port
});

const Product = sequelize.define('products', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    detailUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shortTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    longTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mrp: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    cost: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    discount: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    discountOffer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tagline: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'products' // Explicitly specify the table name
});

const initializeDatabase = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database & tables created!');
    } catch (err) {
        console.error('Error creating database & tables:', err);
    }
};

module.exports = { Product, initializeDatabase };
