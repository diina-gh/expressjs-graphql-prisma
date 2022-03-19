
export async function variants(parent, args, context, info) {

    const where = args.filter
    ? {
      OR: [
        { name: { contains: args.filter } },
        { desc: { contains: args.filter } },
      ],
    }
    : {}

    const skip = args.page && args.take ? (args.page - 1) * args.take : 0
    var query = {where, include: {options: true}, skip: skip,}
    
    if(args.take) query.take = args.take
    if(args.orderBy) query.orderBy = args.orderBy
  
    const variants = await context.prisma.variant.findMany(query)

    const count = await context.prisma.variant.count()
    const countOpt = await context.prisma.option.count()
  
    return {count, countOpt, variants}
  
  }
  
  export async function variant(parent, args, context, info) {

    if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

    let entity = await context.prisma.variant.findUnique({where: {id: args.id,}, include: {options: true },})
    if(!entity) return { __typename: "InputError", message: `Ce variant n'éxiste pas.`,};
   
    return { __typename: "Variant", ...entity,};
    
  }