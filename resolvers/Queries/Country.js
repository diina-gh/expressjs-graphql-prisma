
export async function countries(parent, args, context, info) {

    const where = args.filter
    ? {
      OR: [
        { name: { contains: args.filter } },
        { iso3: { contains: args.filter } },
        { isoNum: { contains: args.filter } },
        { regions: {
          name: {contains: args.filter,},
        },
      }
      ],
    }
    : {}
  
    const items = await context.prisma.country.findMany({
      where,
      include: {regions: {include:{districts:true}}, },
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    return items
  
  }
  
  export async function country(parent, args, context, info) {
    return await prisma.country.findUnique({
        where: {id: args.id,},
        include: {regions: {include:{districts:true}}, },
    })
  }