const prisma = require("../db-config/prismaClient");

// Admin Dashboard Overview
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalBooks = await prisma.book.count();
    const activeLoans = await prisma.loan.count({ where: { returnedAt: null } });
    const pendingReservations = await prisma.reservation.count({
        where:{
           staus: "PENDING" 
        }
    });

    return res.status(200).json({
      totalUsers,
      totalBooks,
      activeLoans,
      pendingReservations,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getDashboardStats };
