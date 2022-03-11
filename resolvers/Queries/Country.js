
export async function countries(parent, args, context, info) {

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
  
    const countries = await context.prisma.country.findMany({
      where,
      include: {regions: {include:{districts:true}}, },
      skip: skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    const count = await context.prisma.country.count()
    return {count, countries}
  
  }
  
  export async function country(parent, args, context, info) {
    return await prisma.country.findUnique({
        where: {id: args.id,},
        include: {regions: {include:{districts:true}}, },
    })
  }