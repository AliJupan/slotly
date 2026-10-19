
class BookingController {
  constructor(bookingService, logger) {
    this.service = bookingService;
    this.logger = logger;
  }

  create() {
    return [
      async (req, res) => {
        try {
          const data = {
            slotId: Number(req.body.slotId),
            name: req.body.name,
            email: req.body.email,
          };

          const booking = await this.service.create(data);

          return res.status(201).json({ booking });
        } catch (error) {
          this.logger.error(`Error creating booking: ${error.message}`);

          if (error.message === "This slot is already booked.") {
            return res.status(409).json({ error: error.message });
          }

          if (error.message === "Slot not found.") {
            return res.status(404).json({ error: error.message });
          }

          if (
            error.message === "Slot ID, name, and email are required." ||
            error.message === "Invalid slot ID." ||
            error.message === "This slot is in the past."
          ) {
            return res.status(400).json({ error: error.message });
          }

          return res.status(500).json({
            error: "Failed to create booking.",
          });
        }
      },
    ];
  }
}

export default BookingController;
