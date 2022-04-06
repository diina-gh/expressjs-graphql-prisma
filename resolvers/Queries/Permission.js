export async function permissions(parent, args, context, info) {

    const where = args.filter && args.filter.length > 1
    ? {
      OR: [
        { name: { contains: args.filter } },
        { desc: { contains: args.filter } },
      ],
    }
    : {}
  
    const skip = args.page && args.take ? (args.page - 1) * args.take : 0
    var query = {where, skip: skip,}
    
    if(args.take) query.take = args.take
    if(args.orderBy) query.orderBy = args.orderBy

    const permissions = await context.prisma.permission.findMany(query)
  
    const count = await context.prisma.permission.count()
    return {count, permissions}
  
  }
  
  export async function permission(parent, args, context, info) {

    if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

    let entity = await context.prisma.permission.findUnique({where: {id: args.id,}})
    if(!entity) return { __typename: "InputError", message: `Cette permission n'éxiste pas.`,};
   
    return { __typename: "Permission", ...entity,};

  }
