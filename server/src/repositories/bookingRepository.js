class BookingRepository {
  constructor(prisma, logger) {
    this.prisma = prisma;
    this.logger = logger;
  }

  async createBooking(data) {
    try {
      return await this.prisma.booking.create({
        data: {
          slotId: data.slotId,
          name: data.name,
          email: data.email,
        },
      });
    } catch (error) {
      this.logger.error(`Error creating booking: ${error.message}`);
      throw error;
    }
  }

  async findBookingBySlotId(slotId) {
    try {
      return await this.prisma.booking.findUnique({
        where: { slotId },
      });
    } catch (error) {
      this.logger.error(`Error finding booking: ${error.message}`);
      throw error;
    }
  }
}

export default BookingRepository;
