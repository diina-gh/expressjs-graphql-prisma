import { PrismaSelect } from '@paljs/plugins';

export async function shipmentStages(parent, args, context, info) {

    const skip = args.page && args.take ? (args.page - 1) * args.take : 0

    const count = await context.prisma.category.count()

    const where = args.filter && args.filter.length > 1
    ? {
      OR: [
        { stage: { contains: args.filter } },
        { desc: { contains: args.filter } },
      ],
    }
    : {}
  
    const items = await context.prisma.shipmentStage.findMany({
      where,
      include: {previous: true },
      skip: skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    return items.map(obj=> ({ ...obj, count }))
  
  }
  
  export async function shipmentStage(parent, args, context, info) {
    return await prisma.shipmentStage.findUnique({
        where: {id: args.id,},
        include: {previous: true },
    })
  }