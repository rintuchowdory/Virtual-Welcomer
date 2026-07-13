import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import servicesRouter from "./services/index.js";
import conversationsRouter from "./conversations/index.js";
import appointmentsRouter from "./appointments/index.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(servicesRouter);
router.use(conversationsRouter);
router.use(appointmentsRouter);

export default router;
