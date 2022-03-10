
export async function shippingMethods(parent, args, context, info) {

    const skip = args.page && args.take ? (args.page - 1) * args.take : 0

    const count = await context.prisma.category.count()

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
      skip: skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    return items.map(obj=> ({ ...obj, count }))
  
  }
  
  export async function shippingMethod(parent, args, context, info) {
    return await prisma.shippingMethod.findUnique({
        where: {id: args.id,},
    })
  }