import { PrismaSelect } from '@paljs/plugins';

export async function deliveryMans(parent, args, context, info) {

    const where = args.filter && args.filter.length > 1
    ? {
      OR: [
        { firstname: { contains: args.filter } },
        { lastname: { contains: args.filter } },
        { email: { contains: args.filter } },
      ],
    }
    : {}

    const skip = args.page && args.take ? (args.page - 1) * args.take : 0
    var query = {where, skip: skip,}
    
    if(args.take) query.take = args.take
    if(args.orderBy) query.orderBy = args.orderBy
  
    const deliveryMans = await context.prisma.deliveryMan.findMany(query)
    const count = await context.prisma.deliveryMan.count()

    return {count, deliveryMans}
  
  }
  
  export async function deliveryMan(parent, args, context, info) {

    if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

    let entity = await context.prisma.deliveryMan.findUnique({ where: { id: args.id } })
    if(!entity) return { __typename: "InputError", message: `Ce livreur n'éxiste pas`,};

    return { __typename: "DeliveryMan", ...entity,};

  }