
export async function regions(parent, args, context, info) {

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
  
    const items = await context.prisma.region.findMany({
      where,
      include: {country: true, districts: true,},
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    return items
  
  }
  
  export async function region(parent, args, context, info) {
    return await prisma.region.findUnique({
        where: {id: args.id,},
        include: {country: true, districts: true,},
    })
  }
  