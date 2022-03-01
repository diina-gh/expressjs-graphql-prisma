
export async function variants(parent, args, context, info) {

    const where = args.filter
    ? {
      OR: [
        { title: { contains: args.filter } },
        { desc: { contains: args.filter } },
      ],
    }
    : {}
  
    const items = await context.prisma.variant.findMany({
      where,
      include: {options: true},
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    return items
  
  }
  
  export async function variant(parent, args, context, info) {
    return await prisma.variant.findUnique({
        where: {id: args.id,},
        include: {options: true},
    })
  }