
export async function permissions(parent, args, context, info) {

    const skip = args.page && args.take ? (args.page - 1) * args.take : 0
    
    const count = await context.prisma.permission.count()

    const where = args.filter
    ? {
      OR: [
        { name: { contains: args.filter } },
        { desc: { contains: args.filter } },
      ],
    }
    : {}
  
    const items = await context.prisma.permission.findMany({
      where,
      include: {roles: {include:{role:true}},},
      skip: skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    return items.map(obj=> ({ ...obj, count }))
  
  }
  
  export async function permission(parent, args, context, info) {
    return await prisma.permission.findUnique({
        where: {id: args.id,},
        include: {roles: {include:{role:true}},},
    })
  }
