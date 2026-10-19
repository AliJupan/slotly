class BookingService {
  constructor(bookingRepository, slotService, logger) {
    this.bookingRepository = bookingRepository;
    this.slotService = slotService;
    this.logger = logger;
  }

  async create(data) {
    try {
      const { slotId, name, email } = data;

      if (!slotId || !name || !email) {
        throw new Error("Slot ID, name, and email are required.");
      }

      if (!Number.isInteger(slotId) || slotId < 1) {
        throw new Error("Invalid slot ID.");
      }

      const slot = await this.slotService.getSlotById(slotId);

      if (new Date(slot.startsAt) <= new Date()) {
        throw new Error("This slot is in the past.");
      }

      const existingBooking =
        await this.bookingRepository.findBookingBySlotId(slotId);

      if (existingBooking) {
        throw new Error("This slot is already booked.");
      }

      const booking = await this.bookingRepository.createBooking({
        slotId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
      });

      return {
        ...booking,
      };
    } catch (error) {
      this.logger.error(`Error creating booking: ${error.message}`);
      throw error;
    }
  }
}

export default BookingService;
