const prisma = require("../db-config/prismaClient");
const dayjs = require("dayjs");

const borrowBook = async (req, res) => {
  try {
    const { bookId, duration } = req.body;
    const userId = req.user.id;

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book || !book.available) throw new Error("Book is not available");

    const dueDate = dayjs().add(duration, "days").toDate();

    const [loan] = await prisma.$transaction([
        prisma.loan.create({
          data: { userId, bookId, dueDate },
        }),
        prisma.book.update({
          where: { id: bookId },
          data: { available: false },
        }),
      ]);

    return res.status(201).json({ message: "Book borrowed successfully", loan });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getLoan = async (req, res) => {
  try {
    const loan = await prisma.loan.findUnique({
      where: { id: req.params.id },
      include: { book: true, user: true },
    });

    if (!loan) throw new Error("Loan not found");

    return res.status(200).json(loan);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Get All Loans (Accessible to Admin)
const getAllLoans = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const [loans, totalLoansCount] = await prisma.$transaction([
        prisma.loan.findMany({
          skip,
          take: limit,
          include: { book: true, user: true },
          orderBy: { borrowedAt: "desc" }, // Sorting newest first
        }),
        prisma.loan.count(), // Total count for pagination metadata
      ]);

      return res.status(200).json({
        totalLoansCount,
        currentPage: page,
        totalPages: Math.ceil(totalLoansCount / limit),
        loans,
      });

  } catch (error) {
    return res.status(500).json({ error: "Server error", message:error.message });
  }
};

// Return a Book
const returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await prisma.loan.findUnique({ where: { id: id } });

    if (!loan || loan.returnedAt) throw new Error("Invalid loan record");

    const now = new Date();
    let fine = 0;

    if (now > loan.dueDate) {
      const daysLate = dayjs(now).diff(dayjs(loan.dueDate), "day");
      fine = daysLate * 5; // ₹5 per day late fine
    }

    await prisma.loan.update({
      where: { id: loan.id },
      data: { returnedAt: now, fine },
    });

    await prisma.book.update({ where: { id: loan.bookId }, data: { available: true } });

    return res.json({ message: "Book returned successfully", fine });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { borrowBook, getLoan, getAllLoans, returnBook };
