
export async function variants(parent, args, context, info) {

    const skip = args.page && args.take ? (args.page - 1) * args.take : 0

    const where = args.filter
    ? {
      OR: [
        { title: { contains: args.filter } },
        { desc: { contains: args.filter } },
      ],
    }
    : {}
  
    const variants = await context.prisma.variant.findMany({
      where,
      include: {options: true},
      skip: skip,
      take: args.take,
      orderBy: args.orderBy,
    })

    const count = await context.prisma.variant.count()
    const countOpt = await context.prisma.category.count()
  
    return {count, countOpt, variants}
  
  }
  
  export async function variant(parent, args, context, info) {
    return await prisma.variant.findUnique({
        where: {id: args.id,},
        include: {options: true},
    })
  }