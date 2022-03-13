
export async function inventories(parent, args, context, info) {

    const skip = args.page && args.take ? (args.page - 1) * args.take : 0
    
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
  
    const inventories = await context.prisma.inventory.findMany({
      where,
      include: {product: true,},
      skip: skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    const count = await context.prisma.inventory.count()
    return {count, inventories}
  
  }
  
  export async function inventory(parent, args, context, info) {
    return await prisma.inventory.findUnique({
        where: {id: args.id,},
        include: {product: true},
    })
  }