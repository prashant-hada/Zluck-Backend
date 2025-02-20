const express = require("express");
const {userProtect} = require("../middleware/middleware");
const {createReservation, cancelReservation} = require("../controllers/reservationController")

const router = express.Router()

router.post("/create", userProtect, createReservation);
router.put("/cancel", userProtect, cancelReservation);

module.exports = router;