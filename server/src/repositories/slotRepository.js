class SlotRepository {
  constructor(prismaClient, logger) {
    this.prisma = prismaClient;
    this.logger = logger;
  }

  async createSlot(data) {
    try {
      const slot = await this.prisma.slot.create({ data: data });

      return slot;
    } catch (error) {
      this.logger.error(`Error creating slot: ${error.message}`);
      throw error;
    }
  }

  async findAllAvailable() {
    try {
      const slots = await this.prisma.slot.findMany({
        where: {
          startsAt: {
            gt: new Date(),
          },
        },
        include: {
          booking: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          startsAt: "asc",
        },
      });

      return slots;
    } catch (error) {
      this.logger.error(`Error fetching available slots: ${error.message}`);
      throw error;
    }
  }

  async findSlotById(id) {
    try {
      const slot = await this.prisma.slot.findUnique({
        where: { id },
      });

      return slot;
    } catch (error) {
      this.logger.error(`Error finding slot: ${error.message}`);
      throw error;
    }
  }
}

export default SlotRepository;
