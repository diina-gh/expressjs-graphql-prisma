
export async function districts(parent, args, context, info) {

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
  
    const items = await context.prisma.district.findMany({
      where,
      include: {region: {include:{country:true}}},
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    return items
  
  }
  
  export async function district(parent, args, context, info) {
    return await prisma.district.findUnique({
        where: {id: args.id,},
        include: {region: {include:{country:true}}},
    })
  }