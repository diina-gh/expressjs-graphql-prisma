import { PrismaSelect } from '@paljs/plugins';

export async function orders(parent, args, context, info) {

    const skip = args.page && args.take ? (args.page - 1) * args.take : 0

    const count = await context.prisma.category.count()

    const where = args.filter && args.filter.length > 1
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
      skip: skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    return items.map(obj=> ({ ...obj, count }))
  
  }
  
  export async function order(parent, args, context, info) {
    return await prisma.order.findUnique({
        where: {id: args.id,},
        include: {user: true, shippingMethod: true },
    })
  }