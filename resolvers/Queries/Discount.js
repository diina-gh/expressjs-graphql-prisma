import { PrismaSelect } from '@paljs/plugins';

export async function discounts(parent, args, context, info) {

    const skip = args.page && args.take ? (args.page - 1) * args.take : 0

    const count = await context.prisma.category.count()

    const where = args.filter
    ? {
      OR: [
        { name: { contains: args.filter } },
        { desc: { contains: args.filter } },
      ],
    }
    : {}
  
    const items = await context.prisma.discount.findMany({
      where,
      include: {products: {include:{options:{include:{option:true}}}}},
      skip: skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    return items.map(obj=> ({ ...obj, count }))
  
  }
  
  export async function discount(parent, args, context, info) {
    return await prisma.discount.findUnique({
        where: {id: args.id,},
        include: {products: {include:{options:{include:{option:true}}}}},
    })
  }