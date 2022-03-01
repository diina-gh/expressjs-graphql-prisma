
export async function roles(parent, args, context, info) {

    const where = args.filter
    ? {
      OR: [
        { title: { contains: args.filter } },
        { desc: { contains: args.filter } },
      ],
    }
    : {}
  
    const items = await context.prisma.role.findMany({
      where,
      include: {permissions: {include:{permission:true}}},
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    return items
  
  }
  
  export async function role(parent, args, context, info) {
    return await prisma.role.findUnique({
        where: {id: args.id,},
        include: {permissions: {include:{permission:true}}},
    })
  }