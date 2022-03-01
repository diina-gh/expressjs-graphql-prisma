
export async function permissions(parent, args, context, info) {

    const where = args.filter
    ? {
      OR: [
        { title: { contains: args.filter } },
        { desc: { contains: args.filter } },
      ],
    }
    : {}
  
    const items = await context.prisma.permission.findMany({
      where,
      skip: args.skip,
      take: args.take,
      orderBy: args.updatedat,
    })
  
    return items
  
  }
  
  export async function permission(parent, args, context, info) {
    return await prisma.permission.findUnique({
        where: {
        id: args.id,
        }
    })
  }