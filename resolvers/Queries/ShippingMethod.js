import { PrismaSelect } from '@paljs/plugins';

export async function shippingMethods(parent, args, context, info) {

    const where = args.filter
    ? {
      OR: [
        { name: { contains: args.filter } },
        { code: { contains: args.filter } },
        { desc: { contains: args.filter } },
      ],
    }
    : {}

    const skip = args.page && args.take ? (args.page - 1) * args.take : 0
    var query = {where, skip: skip,}
    
    if(args.take) query.take = args.take
    if(args.orderBy) query.orderBy = args.orderBy
  
    const shippingMethods = await context.prisma.shippingMethod.findMany(query)
  
    const count = await context.prisma.shippingMethod.count()
    return {count, shippingMethods}
  
  }
  
  export async function shippingMethod(parent, args, context, info) {

    if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

    let entity = await context.prisma.shippingMethod.findUnique({where: {id: args.id,},})
    if(!entity) return { __typename: "InputError", message: `Ce mode de livraison n'éxiste pas.`,};

    return { __typename: "ShippingMethod", ...entity,};

  }