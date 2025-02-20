const express = require("express");
const {userProtect, isAdmin} = require("../middleware/middleware");
const {getDashboardStats, getAllReservations, getAllUsers} = require("../controllers/adminController");

const router = express.Router();

router.get("/stats", userProtect, isAdmin, getDashboardStats);
router.get("/users", userProtect, isAdmin, getAllUsers);
router.get("/reservation", userProtect, isAdmin, getAllReservations);

module.exports = router;