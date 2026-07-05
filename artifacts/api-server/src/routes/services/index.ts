import { Router, type IRouter } from "express";
import { ListServicesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const SERVICES = [
  {
    id: "consultation",
    name: "Initial Consultation",
    description: "A free 20-minute call to discuss your needs and see how we can help.",
    durationMinutes: 20,
    icon: "MessageCircle",
  },
  {
    id: "strategy-session",
    name: "Strategy Session",
    description: "A focused 45-minute session to map out a plan tailored to your goals.",
    durationMinutes: 45,
    icon: "Compass",
  },
  {
    id: "full-review",
    name: "Full Account Review",
    description: "An in-depth 60-minute review of your account, progress, and next steps.",
    durationMinutes: 60,
    icon: "ClipboardList",
  },
  {
    id: "support-call",
    name: "Support Call",
    description: "A quick 15-minute call for technical support or general questions.",
    durationMinutes: 15,
    icon: "Headset",
  },
];

router.get("/services", (_req, res) => {
  res.json(ListServicesResponse.parse(SERVICES));
});

export default router;
