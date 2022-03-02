
export async function inventories(parent, args, context, info) {

    const where = args.filter
    ? {
      OR: [
        { details: { contains: args.filter } },
        { product: {
            name: {contains: args.filter,},
            short_desc: {contains: args.filter,},
          },
        }
      ],
    }
    : {}
  
    const items = await context.prisma.inventory.findMany({
      where,
      include: {product: true,},
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    return items
  
  }
  
  export async function inventory(parent, args, context, info) {
    return await prisma.inventory.findUnique({
        where: {id: args.id,},
        include: {product: true},
    })
  }