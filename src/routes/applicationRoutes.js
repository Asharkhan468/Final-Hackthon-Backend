// routes/loanRoutes.js

import express from "express"
import { submitLoanApplication } from "../controllers/application.controllers.js";

const router = express.Router();

// POST route for loan application
router.post("/loanApplication", submitLoanApplication);

export default router
