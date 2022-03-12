
export async function deliveryMans(parent, args, context, info) {

    const skip = args.page && args.take ? (args.page - 1) * args.take : 0

    const where = args.filter
    ? {
      OR: [
        { name: { contains: args.filter } },
        { iso3: { contains: args.filter } },
        { isoNum: { contains: args.filter } },
      ],
    }
    : {}
  
    const deliveryMans = await context.prisma.deliveryMan.findMany({
      where,
      skip: skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    const count = await context.prisma.deliveryMan.count()
    return {count, deliveryMans}
  
  }
  
  export async function deliveryMan(parent, args, context, info) {
    return await prisma.deliveryMan.findUnique({
        where: {id: args.id,},
    })
  }