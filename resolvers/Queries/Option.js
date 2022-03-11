
export async function options(parent, args, context, info) {

    const skip = args.page && args.take ? (args.page - 1) * args.take : 0

    const where = args.filter
    ? {
      OR: [
        { title: { contains: args.filter } },
        { desc: { contains: args.filter } },
      ],
    }
    : {}
  
    const options = await context.prisma.option.findMany({
      where,
      include: {variant: true},
      skip: skip,
      take: args.take,
      orderBy: args.orderBy,
    })

    const count = await context.prisma.option.count()  
    return {count, options}
  
  }
  
  export async function option(parent, args, context, info) {
    return await prisma.option.findUnique({
        where: {id: args.id,},
        include: {variant: true},
    })
  }