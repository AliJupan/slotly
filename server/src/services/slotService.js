class SlotService {
  constructor(slotRepository, logger) {
    this.repository = slotRepository;
    this.logger = logger;
  }

  async createSlot(data) {
    try {
      const { startsAt, durationMinutes } = data;

      if (!startsAt || !durationMinutes) {
        throw new Error("Start date and duration are required.");
      }

      const startDate = new Date(startsAt);

      if (Number.isNaN(startDate.getTime())) {
        throw new Error("Invalid start date.");
      }

      if (startDate <= new Date()) {
        throw new Error("Slot must be in the future.");
      }

      if (
        !Number.isInteger(durationMinutes) ||
        durationMinutes < 1 ||
        durationMinutes > 480
      ) {
        throw new Error("Duration must be between 1 and 480 minutes.");
      }

      const slot = await this.repository.createSlot({
        startsAt: startDate,
        durationMinutes,
      });

      return slot;
    } catch (error) {
      this.logger.error(`Error creating slot: ${error.message}`);
      throw error;
    }
  }

  async getAvailableSlots() {
    try {
      return await this.repository.findAllAvailable();
    } catch (error) {
      this.logger.error(`Error getting available slots: ${error.message}`);
      throw error;
    }
  }

  async getSlotById(id) {
    try {
      if (!Number.isInteger(id) || id < 1) {
        throw new Error("Invalid slot ID.");
      }

      const slot = await this.repository.findSlotById(id);

      if (!slot) {
        throw new Error("Slot not found.");
      }

      return slot;
    } catch (error) {
      this.logger.error(`Error getting slot: ${error.message}`);
      throw error;
    }
  }
}

export default SlotService;
