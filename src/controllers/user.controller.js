import { unlinkSync } from "fs";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { userMessage } from "../config/msg";
import { checkUser } from "../services/user.service";
import { User, imgPath } from "../models/user.model.js";
import { object, string, valid, ref, array } from "joi";
import { SECRET_KEY } from "../config/constant.js";

const deletefile = async (file) => {
  try {
    if (file && file.path) {
      await unlinkSync(file.path);
    }
  } catch (error) {
    console.log(error);
  }
};

const registerSchema = object({
  name: string().min(6).max(10).required().messages({
    "any.required": "Name is required.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name must be at most 10 characters long.",
    "string.empty": "Name cannot be empty.",
  }),
  email: string().email().required().messages({
    "any.required": "Email is required.",
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email cannot be empty.",
  }),
  password: string().min(6).max(20).required().messages({
    "any.required": "Password is required.",
    "string.min": "Password must be at least 6 characters long.",
    "string.max": "Password must be at most 20 characters long.",
    "string.empty": "Password cannot be empty.",
  }),
  confirmPassword: valid(ref("password")).required().messages({
    "any.only": "Passwords must match.",
  }),
  gender: string().required().messages({
    "any.required": "Gender is required.",
    "string.empty": "Gender cannot be empty.",
  }),
  interest: array().items(string()).required().messages({
    "any.required": "Interest is required.",
    "array.base": "Interest must be an array of strings.",
    "array.empty": "Interest cannot be empty.",
  }),
});

const loginSchema = object({
  email: string().email().required().messages({
    "any.required": "Email is required.",
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email cannot be empty.",
  }),
  password: string().min(6).max(20).required().messages({
    "any.required": "Password is required.",
    "string.min": "Password must be at least 6 characters long.",
    "string.max": "Password must be at most 20 characters long.",
    "string.empty": "Password cannot be empty.",
  }),
});

const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      await deletefile(req.file);
      return res
        .status(400)
        .json({ message: error.details.map((err) => err.message) });
    }

    const { name, email, password, gender, interest } = value;
    const finduser = await checkUser(email);
    if (finduser) {
      await deletefile(req.file);
      return res.status(400).json({
        message: userMessage.error.invalidEmail,
      });
    }
    let image = "";
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      image = baseUrl + imgPath + "/" + req.file.filename;
    }

    const newUser = {
      name,
      email,
      gender,
      interest,
      image,
      password: await hash(password, 10),
    };

    const user = await User.create(newUser);
    if (!user) {
      return res.status(400).json({ message: userMessage.error.signUpError });
    }

    return res.status(201).json({ message: userMessage.success.signUpSuccess });
  } catch (error) {
    if (req.file) {
      await deletefile(req.file);
    }
    if (error.name === "SequelizeValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ errors });
    }
    return res.status(500).json({ message: userMessage.error.genericError });
  }
};

const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((err) => err.message) });
    }
    const { email, password } = value;
    const isUserExist = await checkUser(email);
    if (!isUserExist)
      return res.status(404).json({ message: userMessage.error.userNotFound });

    const isValidPassword = await compare(
      password,
      isUserExist.password
    );
    if (!isValidPassword)
      return res.status(400).json({ message: userMessage.error.wrongPassword });

    const token = sign({ data: isUserExist }, SECRET_KEY, {
      expiresIn: "4h",
    });
    res.cookie("token", token, { httpOnly: true });

    return res
      .status(200)
      .json({ message: userMessage.success.loginSuccess, token });
  } catch (error) {
    return res.status(500).json({ message: userMessage.error.genericError });
  }
};

const profile = (req, res) => {
  try {
    const { password, ...userDetails } = req.user;
    return res
      .status(200)
      .json({
        message: userMessage.success.profileRetrieved,
        profile: { ...userDetails },
      });
  } catch (error) {
    return res.status(404).json({ message: userMessage.error.genericError });
  }
};

export default { register, login, profile };
