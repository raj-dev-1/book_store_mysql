const Joi = require("joi");
const { bookMessage } = require("../config/msg");
const Book = require("../models/book.model");
const { User } = require("../models/user.model");

const createBookSchema = Joi.object({
  bookName: Joi.string().required().messages({
    "any.required": "Book name is required.",
    "string.empty": "Book name cannot be empty.",
  }),
  bookDesc: Joi.string().required().messages({
    "any.required": "Book description is required.",
    "string.empty": "Book description cannot be empty.",
  }),
  noOfPages: Joi.number().integer().min(1).required().messages({
    "any.required": "Number of pages is required.",
    "number.base": "Number of pages must be a number.",
    "number.integer": "Number of pages must be an integer.",
    "number.min": "Number of pages must be at least 1.",
  }),
  bookAuthor: Joi.string().required().messages({
    "any.required": "Book author is required.",
    "string.empty": "Book author cannot be empty.",
  }),
  bookCategory: Joi.string().required().messages({
    "any.required": "Book category is required.",
    "string.empty": "Book category cannot be empty.",
  }),
  bookPrice: Joi.number().precision(2).required().messages({
    "any.required": "Book price is required.",
    "number.base": "Book price must be a number.",
    "number.precision": "Book price must have 2 decimal places at most.",
  }),
  releasedYear: Joi.number().integer().min(1500).required().messages({
    "any.required": "Released year is required.",
    "number.base": "Released year must be a number.",
    "number.integer": "Released year must be an integer.",
    "number.min": "Released year must be at least 1500.",
  }),
});

const create = async (req, res) => {
  try {
    const { error } = createBookSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if (!req.body)
      return res.status(400).json({ message: bookMessage.error.fillDetails });
    const { userId = req.user.id, ...bookData } = req.body;

    const newBook = await Book.create({ userId, ...bookData });
    if (!newBook)
      return res.status(404).json({ message: bookMessage.error.add });
    return res.status(201).json({ message: bookMessage.success.add });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ errors });
    }
    return res.status(500).json({ message: bookMessage.error.genericError });
  }
};

const list = async (req, res) => {
  try {
    const { page, bookName, limit } = req.query;
    if (bookName && bookName.trim()) {
      const regex = new RegExp(bookName, "i");
      const searchBook = await Book.findAll({ bookName: regex });
      return res.status(200).json({
        message: bookMessage.success.fetch,
        books: searchBook,
      });
    }
    const pageCount = page || 1;
    const limitDoc = limit || 10;
    const totalBook = await Book.count({ status: true });
    const maxPage = totalBook <= limitDoc ? 1 : Math.ceil(totalBook / limitDoc);
    if (pageCount > maxPage)
      return res
        .status(400)
        .json({ message: `There are only ${maxPage} page` });
    const skip = (pageCount - 1) * limitDoc;

    const bookList = await Book.findAll({
      where: { status: true },
      limit: limitDoc,
      offset: skip,
    });

    return res.status(200).json({
      message: bookMessage.success.fetch,
      bookList: bookList,
    });
  } catch (error) {
    return res.status(500).json({ message: bookMessage.error.genericError });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;

    const editBookDetails = await Book.update(req.body, {
      where: { id },
      runValidators: true,
    });
    if (!editBookDetails) {
      return res.status(404).json({ message: bookMessage.error.update });
    }
    return res.status(200).json({
      message: bookMessage.success.update,
      editBookDetails,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ errors });
    }
    return res.status(500).json({ message: bookMessage.error.genericError });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteBook = await Book.destroy({
      where: { id },
    });
    if (!deleteBook) {
      return res.status(404).json({ message: bookMessage.error.delete });
    }
    return res.status(200).json({
      message: bookMessage.success.delete,
      deleteBook,
    });
  } catch (error) {
    return res.status(500).json({ message: bookMessage.error.genericError });
  }
};

const bookDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const bookDetails = await Book.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    if (!bookDetails)
      return res.status(404).json({ message: bookMessage.error.notFound });

    return res.status(200).json({
      message: bookMessage.success.fetch,
      bookDetails,
    });
  } catch (error) {
    return res.status(500).json({ message: bookMessage.error.genericError });
  }
};

module.exports = { create, list, update, remove, bookDetails };
