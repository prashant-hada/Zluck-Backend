const express = require("express");
const {userProtect, isAdmin} = require("../middleware/middleware");
const {getDashboardStats} = require("../controllers/adminController");

const router = express.Router();

router.get("/stats", userProtect, isAdmin, getDashboardStats);

module.export = router;