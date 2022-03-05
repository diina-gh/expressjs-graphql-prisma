
export async function shippingMethods(parent, args, context, info) {

    const where = args.filter
    ? {
      OR: [
        { name: { contains: args.filter } },
        { code: { contains: args.filter } },
        { desc: { contains: args.filter } },
      ],
    }
    : {}
  
    const items = await context.prisma.shippingMethod.findMany({
      where,
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    return items
  
  }
  
  export async function shippingMethod(parent, args, context, info) {
    return await prisma.shippingMethod.findUnique({
        where: {id: args.id,},
    })
  }