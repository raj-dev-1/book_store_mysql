const path = require("path");
const multer = require("multer");
const imgPath = "/uploads/user";
const { DataTypes } = require("sequelize");
const db = require("../config/sequelize");

const User = db.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 9],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Please enter a valid email address",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    interest: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        const value = this.getDataValue("interest");
        return value ? value.split(",") : [];
      },
      set(value) {
        this.setDataValue("interest", value.join(","));
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["email", "password"],
      },
    ],
  }
);

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", imgPath));
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + extension);
  },
});

const uploadImgPath = multer({ storage: imageStorage }).single("image");

module.exports = { User, uploadImgPath, imgPath };
