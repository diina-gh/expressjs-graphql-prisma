
export async function districts(parent, args, context, info) {

    const skip = args.page && args.take ? (args.page - 1) * args.take : 0

    const where = args.filter
    ? {
      OR: [
        { name: { contains: args.filter } },
        { region: {
          name: {contains: args.filter,},
          code: {contains: args.filter,},
        },
      }
      ],
    }
    : {}
  
    const districts = await context.prisma.district.findMany({
      where,
      include: {region: {include:{country:true}}},
      skip: skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    const count = await context.prisma.district.count()
    const countRegions = await context.prisma.region.count()
    const countCountries = await context.prisma.country.count()

    return {count, countRegions, countCountries, districts}
  
  }
  
  export async function district(parent, args, context, info) {
    return await prisma.district.findUnique({
        where: {id: args.id,},
        include: {region: {include:{country:true}}},
    })
  }