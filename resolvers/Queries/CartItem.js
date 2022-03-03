
export async function cartItems(parent, args, context, info) {

    const where = args.filter
    ? {
      OR: [
        // { details: { contains: args.filter } },
        { product: {
            name: {contains: args.filter,},
            short_desc: {contains: args.filter,},
          },
        }
      ],
    }
    : {}
  
    const items = await context.prisma.cartItem.findMany({
      where,
      include: {product: true, optionsOnProducts: {include :{option: true}} },
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    return items
  
  }
  
  export async function cartItem(parent, args, context, info) {
    return await prisma.cartItem.findUnique({
        where: {id: args.id,},
        include: {product: true, optionsOnProducts: {include :{option: true}} },
    })
  }