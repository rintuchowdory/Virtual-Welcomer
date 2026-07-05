import { Router, type IRouter } from "express";
import healthRouter from "./health";
import servicesRouter from "./services";
import conversationsRouter from "./conversations";
import appointmentsRouter from "./appointments";

const router: IRouter = Router();

router.use(healthRouter);
router.use(servicesRouter);
router.use(conversationsRouter);
router.use(appointmentsRouter);

export default router;
