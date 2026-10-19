import "dotenv/config";
import http from "http";

import logger from "./utils/logger.js";
import { connectDB, prisma } from "./config/prisma.js";

import SlotRepository from "./repositories/slotRepository.js";
import SlotService from "./services/slotService.js";
import SlotController from "./controllers/slotController.js";

import BookingRepository from "./repositories/bookingRepository.js";
import BookingService from "./services/bookingService.js";
import BookingController from "./controllers/bookingController.js";

import createApp from "./app.js";


const slotRepository = new SlotRepository(prisma, logger);
const slotService = new SlotService(slotRepository, logger);
const slotController = new SlotController(slotService, logger);

const bookingRepository = new BookingRepository(prisma, logger);
const bookingService = new BookingService(
  bookingRepository,
  slotService,
  logger
);
const bookingController = new BookingController(bookingService, logger);

const app = createApp(slotController, bookingController);
const server = http.createServer(app);

const PORT = process.env.PORT || 4500;

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

startServer();
