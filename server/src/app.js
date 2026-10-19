
import express from "express";
import cors from "cors";

import slotRoutes from "./routes/slotRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const createApp = (slotController, bookingController) => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api/slots", slotRoutes(slotController));
  app.use("/api/bookings", bookingRoutes(bookingController));

  return app;
};

export default createApp;
