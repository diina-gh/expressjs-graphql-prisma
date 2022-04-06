import { PrismaSelect } from '@paljs/plugins';

export async function cartItems(parent, args, context, info) {

    const skip = args.page && args.take ? (args.page - 1) * args.take : 0

    const count = await context.prisma.category.count()

    const where = args.filter && args.filter.length > 1
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
      skip: skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    return items.map(obj=> ({ ...obj, count }))
  
  }
  
  export async function cartItem(parent, args, context, info) {
    return await prisma.cartItem.findUnique({
        where: {id: args.id,},
        include: {product: true, optionsOnProducts: {include :{option: true}} },
    })
  }