
export async function discounts(parent, args, context, info) {

    const where = args.filter
    ? {
      OR: [
        { title: { contains: args.filter } },
        { desc: { contains: args.filter } },
      ],
    }
    : {}
  
    const items = await context.prisma.discount.findMany({
      where,
      include: {products: {include:{options:{include:{option:true}}}}},
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    return items
  
  }
  
  export async function discount(parent, args, context, info) {
    return await prisma.discount.findUnique({
        where: {id: args.id,},
        include: {products: {include:{options:{include:{option:true}}}}},
    })
  }