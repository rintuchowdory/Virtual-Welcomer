import { Router, type IRouter } from "express";
import { db, appointmentsTable, eq, asc } from "@workspace/db";
import {
  ListAppointmentsResponse,
  CreateAppointmentBody,
  CreateAppointmentResponse,
  GetAppointmentAvailabilityQueryParams,
  GetAppointmentAvailabilityResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const ALL_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

router.get("/appointments", async (_req, res): Promise<void> => {
  const appointments = await db
    .select()
    .from(appointmentsTable)
    .orderBy(asc(appointmentsTable.date), asc(appointmentsTable.time));

  res.json(ListAppointmentsResponse.parse(appointments));
});

router.get("/appointments/availability", async (req, res): Promise<void> => {
  const query = GetAppointmentAvailabilityQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const dateStr = query.data.date.toISOString().slice(0, 10);

  const booked = await db
    .select()
    .from(appointmentsTable)
    .where(eq(appointmentsTable.date, dateStr));

  const bookedTimes = new Set(
    booked.filter((b) => b.status === "confirmed").map((b) => b.time),
  );

  const slots = ALL_SLOTS.filter((slot) => !bookedTimes.has(slot));

  res.json(
    GetAppointmentAvailabilityResponse.parse({ date: dateStr, slots }),
  );
});

router.post("/appointments", async (req, res): Promise<void> => {
  const parsed = CreateAppointmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const dateStr = parsed.data.date.toISOString().slice(0, 10);

  const [appointment] = await db
    .insert(appointmentsTable)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      service: parsed.data.service,
      date: dateStr,
      time: parsed.data.time,
      notes: parsed.data.notes,
    })
    .returning();

  res.status(201).json(CreateAppointmentResponse.parse(appointment));
});

export default router;
