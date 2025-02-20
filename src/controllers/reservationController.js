const prisma = require("../db-config/prismaClient");

// Create a reservation
const createReservation = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    // Checking if book exists
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Check if the book is already loaned out
    const activeLoan = await prisma.loan.findFirst({
      where: { bookId, returnedAt: null },
    });

    if (!activeLoan) {
      return res.status(400).json({ error: "Book is available, no need to reserve." });
    }

    // Check if the user already has 3 active reservations
    const activeReservations = await prisma.reservation.count({
      where: { userId, status: "PENDING" },
    });

    if (activeReservations >= 3) {
      return res.status(400).json({ error: "User already has 3 active reservations." });
    }

    const reservedAt = new Date();

    // Create the reservation
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        bookId,
        reservedAt ,
      },
    });

    return res.status(201).json({
      message: "Reservation created successfully.",
      reservation,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

const cancelReservation = async (req, res) => {
    try {
      const { reservationId } = req.params;
  
      const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });
      if (!reservation) return res.status(404).json({ error: "Reservation not found" });
  
      await prisma.reservation.update({
        where: { id: reservationId },
        data: { status: "CANCELLED" },
      });
  
      return res.status(200).json({ message: "Reservation cancelled successfully." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  };

  
module.exports = { createReservation, cancelReservation };
