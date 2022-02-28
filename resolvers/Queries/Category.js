
export async function categories(parent, args, context, info) {

    const where = args.filter
    ? {
      OR: [
        { name: { contains: args.filter } },
        { desc: { contains: args.filter } },
        { long_desc: { contains: args.filter } },
      ],
    }
    : {}
  
    const items = await context.prisma.category.findMany({
      where,
      include: {
        parent: true,
        childs: true
      },
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    return items
  
  }
  
  export async function category(parent, args, context, info) {
    return await prisma.category.findUnique({
        where: {
        id: args.id,
        }
    })
  }