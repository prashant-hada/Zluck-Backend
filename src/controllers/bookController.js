const prisma = require("../db-config/prismaClient");

const createBook = async (req, res) => {
  try {
    const { title, author, genre, isbn } = req.body;

    const existingBook = await prisma.book.findUnique({ where: { isbn } });
    if (existingBook) throw new Error("Book with this ISBN already exists");

    const book = await prisma.book.create({
      data: { title, author, genre, isbn },
    });

    return res.status(201).json({ message: "Book added successfully", book });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await prisma.book.findUnique({ where: { id: String(id) } });

    if (!book) throw new Error("Book not found");

    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

const getAllBooks = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    
    const [books, totalBookCount] = await prisma.$transaction([
        prisma.book.findMany(),
        prisma.book.count(), 
      ]);

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, isbn, available } = req.body;

    const book = await prisma.book.update({
      where: { id: String(id) },
      data: { title, author, genre, isbn, available },
    });

    return res.json({ message: "Book updated successfully", book });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.book.delete({ where: { id: Number(id) } });

    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { createBook, getBook, getAllBooks, updateBook, deleteBook };
