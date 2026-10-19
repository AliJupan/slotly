import express from "express";

const bookingRoutes = (bookingController) => {
  const router = express.Router();

  router.post("/", ...bookingController.create());

  return router;
};

export default bookingRoutes;
