const express = require("express");
const { userProtect, isAdmin } = require("../middleware/middleware.js");
const {createBook, getAllBooks, getBook, updateBook, deleteBook} = require("../controllers/bookController");

const router = express.Router();

router.post("/", userProtect,isAdmin, createBook);
router.get("/:id", userProtect, getBook);
router.get("/", userProtect, getAllBooks);
router.put("/:id", userProtect,isAdmin, updateBook);
router.delete("/:id", userProtect, isAdmin, deleteBook);

module.exports = router;
