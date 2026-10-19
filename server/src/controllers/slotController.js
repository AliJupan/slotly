class SlotController {
  constructor(slotService, logger) {
    this.service = slotService;
    this.logger = logger;
  }

  create() {
    return [
      async (req, res) => {
        try {
          const data = req.body;

          const slot = await this.service.createSlot(data);

          return res.status(201).json({ slot });
        } catch (error) {
          this.logger.error(`Error creating slot: ${error.message}`);

          return res.status(error.statusCode || 500).json({
            error:
              error.statusCode && error.statusCode !== 500
                ? error.message
                : "Failed to create slot.",
          });
        }
      },
    ];
  }

  getAvailable() {
    return [
      async (req, res) => {
        try {
          const slots = await this.service.getAvailableSlots();

          return res.status(200).json({ slots });
        } catch (error) {
          this.logger.error(
            `Error fetching available slots: ${error.message}`
          );

          return res.status(500).json({
            error: "Failed to fetch available slots.",
          });
        }
      },
    ];
  }

  getById() {
    return [
      async (req, res) => {
        try {
          const id = Number(req.params.id);

          const slot = await this.service.getSlotById(id);

          return res.status(200).json({ slot });
        } catch (error) {
          this.logger.error(`Error fetching slot: ${error.message}`);

          return res.status(error.statusCode || 500).json({
            error:
              error.statusCode && error.statusCode !== 500
                ? error.message
                : "Failed to fetch slot.",
          });
        }
      },
    ];
  }
}

export default SlotController; 