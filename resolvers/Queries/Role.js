
export async function roles(parent, args, context, info) {

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
  
    const items = await context.prisma.role.findMany({
      where,
      include: {permissions: {include:{permission:true}}},
      skip: skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    return items.map(obj=> ({ ...obj, count }))
  
  }
  
  export async function role(parent, args, context, info) {
    return await prisma.role.findUnique({
        where: {id: args.id,},
        include: {permissions: {include:{permission:true}}},
    })
  }