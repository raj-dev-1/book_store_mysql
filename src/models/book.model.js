const { DataTypes } = require("sequelize");
const db = require("../config/sequelize");
const { User } = require("./user.model.js");

const Book = db.define("book", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bookName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 50],
    },
  },
  bookDesc: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 200],
    },
  },
  noOfPages: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 10,
    },
  },
  bookAuthor: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 50],
    },
  },
  bookCategory: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 30],
    },
  },
  bookPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  releasedYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1500,
    },
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

Book.belongsTo(User, { onDelete: "CASCADE", foreignKey: "userId" });

module.exports = Book;
