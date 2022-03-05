
export async function shipmentStages(parent, args, context, info) {

    const where = args.filter
    ? {
      OR: [
        { stage: { contains: args.filter } },
        { desc: { contains: args.filter } },
      ],
    }
    : {}
  
    const items = await context.prisma.shipmentStage.findMany({
      where,
      include: {previous: true },
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    return items
  
  }
  
  export async function shipmentStage(parent, args, context, info) {
    return await prisma.shipmentStage.findUnique({
        where: {id: args.id,},
        include: {previous: true },
    })
  }