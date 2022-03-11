
export async function regions(parent, args, context, info) {

    const skip = args.page && args.take ? (args.page - 1) * args.take : 0

    const where = args.filter
    ? {
      OR: [
        { name: { contains: args.filter } },
        { code: { contains: args.filter } },
        { country: {
            name: {contains: args.filter,},
            iso3: {contains: args.filter,},
            isoNum: {contains: args.filter,},
            },
        }
      ],
    }
    : {}
  
    const regions = await context.prisma.region.findMany({
      where,
      include: {country: true, districts: true,},
      skip: skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    const count = await context.prisma.region.count()
    return {count, regions}
  
  }
  
  export async function region(parent, args, context, info) {
    return await prisma.region.findUnique({
        where: {id: args.id,},
        include: {country: true, districts: true,},
    })
  }
  