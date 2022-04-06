import { PrismaSelect } from '@paljs/plugins';

export async function options(parent, args, context, info) {

    const where = args.filter && args.filter.length > 1
    ? {
      OR: [
        { name: { contains: args.filter } },
        { desc: { contains: args.filter } },
      ],
    }
    : {}

    const skip = args.page && args.take ? (args.page - 1) * args.take : 0
    var query = {where, include: {variant: true}, skip: skip,}
    
    if(args.take) query.take = args.take
    if(args.orderBy) query.orderBy = args.orderBy
  
    const options = await context.prisma.option.findMany(query)

    const count = await context.prisma.option.count()  
    return {count, options}
  
  }
  
  export async function option(parent, args, context, info) {

    if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

    let entity =  await prisma.option.findUnique({where: {id: args.id,},  include: {variant: true}})
    if(!entity) return { __typename: "InputError", message: `Ce produit n'éxiste pas.`,};
  
    return { __typename: "Product", ...entity,};

  }