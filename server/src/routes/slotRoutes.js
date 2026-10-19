import express from "express";

const slotRoutes = (slotController) => {
  const router = express.Router();

  router.get("/", ...slotController.getAvailable());
  router.get("/:id", ...slotController.getById());
  router.post("/", ...slotController.create());

  return router;
};

export default slotRoutes;