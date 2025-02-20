const express = require("express");
const { userProtect, isAdmin } = require("../middleware/middleware.js");
const {borrowBook, getLoan, getAllLoans, returnBook} = require("../controllers/loanController");

const router = express.Router();

router.post("/", userProtect, borrowBook);
router.get("/:id", userProtect, getLoan);
router.get("/", userProtect, isAdmin, getAllLoans);
router.put("/:id/return", userProtect, returnBook);

module.exports = router;
