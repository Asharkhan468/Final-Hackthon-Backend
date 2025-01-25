import express from "express";
const router = express.Router();

import getLoanCategories from "../controllers/loanController.js";

// Properly define route
router.get("/loans", getLoanCategories);

export default router;
