
export async function orders(parent, args, context, info) {

    const where = args.filter
    ? {
      OR: [
        { firstname: { contains: args.filter } },
        { lastname: { contains: args.filter } },
        { phonenumber: { contains: args.filter } },
        { email: { contains: args.filter } },
        { line1: { contains: args.filter } },
      ],
    }
    : {}
  
    const items = await context.prisma.order.findMany({
      where,
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    return items
  
  }
  
  export async function order(parent, args, context, info) {
    return await prisma.order.findUnique({
        where: {id: args.id,},
        include: {user: true, shippingMethod: true },
    })
  }