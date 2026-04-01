import { Router } from "express";
import { SalesController } from "../controllers/sales.controller";
import { authenticate } from "../middleware/auth";
import { managerPlus, allRoles } from "../middleware/rbac";

const router = Router();

// Any staff can create a sale (cashier at the POS)
router.post("/", authenticate, allRoles, SalesController.create);

// Reports restricted to manager/admin
router.get("/", authenticate, allRoles, SalesController.list);
router.get(
  "/summary/daily",
  authenticate,
  managerPlus,
  SalesController.getDailySummary,
);
router.get(
  "/summary/weekly",
  authenticate,
  managerPlus,
  SalesController.getWeeklySummary,
);
// AFTER
router.get('/:id', authenticate, allRoles, SalesController.get)
export default router;
