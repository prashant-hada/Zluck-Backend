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

const getAllUsers = async (req, res) => {
    try {
      const { role, isActive, search, page = 1, limit = 10, sort = "desc" } = req.query;
  
      // Convert pagination params to numbers
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);
  
      const [users, totalUsersCount] = await prisma.$transaction(async(tx)=>{
        const users = await tx.user.findMany({
            where: {
              role: role || undefined,
              isActive: isActive !== undefined ? isActive === "true" : undefined,
              OR: search
                ? [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                  ]
                : undefined,
            },
            select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
            orderBy: { createdAt: sort === "asc" ? "asc" : "desc" }, // Default: newest first
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
          });
      
          // Get total count for pagination metadata
          const totalUsersCount = await tx.user.count({
            where: {
              role: role || undefined,
              isActive: isActive !== undefined ? isActive === "true" : undefined,
              OR: search
                ? [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                  ]
                : undefined,
            },
          })

          return [users, totalUsersCount];
      })
  
      return res.status(200).json({
        users,
        pagination: {
          totalUsersCount,
          totalPages: Math.ceil(totalUsersCount / pageSize),
          currentPage: pageNumber,
          pageSize,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  };
  

  const getAllReservations = async (req, res) => {
    try {
      const { userId, bookId, status, page = 1, limit = 10, sort = "desc"} = req.query;
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);
  

      const [reservations, totalReservationCount] = await prisma.$transaction(async(tx)=>{
        const reservations = await tx.reservation.findMany({
            where: {
              userId: userId ? Number(userId) : undefined,
              bookId: bookId ? Number(bookId) : undefined,
              status: status ? status.toUpperCase() : undefined,
            },
            include: { user: true, book: true },
            orderBy: { reservedAt: sort === "asc" ? "asc" : "desc" }, // Default: newest first
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
          });

          const totalReservationCount = await tx.reservation.count({
            where: {
              userId: userId ? Number(userId) : undefined,
              bookId: bookId ? Number(bookId) : undefined,
              status: status ? status.toUpperCase() : undefined,
            }
        });
        return [reservations, totalReservationCount];
      })
  
      return res.status(200).json({
        reservations,
        pagination: {
          totalReservationCount,
          totalPages: Math.ceil(totalReservationCount / pageSize),
          currentPage: pageNumber,
          pageSize,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  };
  

module.exports = { getDashboardStats, getAllUsers, getAllReservations };
