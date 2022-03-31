import { PrismaSelect } from '@paljs/plugins';

export async function paymentMethods(parent, args, context, info) {

    const where = args.filter
    ? {
      OR: [
        { name: { contains: args.filter } },
        { code: { contains: args.filter } },
        { desc: { contains: args.filter } },
      ],
    }
    : {}

    const selectedFields = new PrismaSelect(info).valueOf('paymentMethods');
    const skip = args.page && args.take ? (args.page - 1) * args.take : 0
    var query = {where,  select: selectedFields.select, skip: skip,}
    if(args.take) query.take = args.take
    if(args.orderBy) query.orderBy = args.orderBy
  
    const paymentMethods = await context.prisma.paymentMethod.findMany(query)
  
    const count = await context.prisma.paymentMethod.count()
    return {count, paymentMethods}
  
  }
  
  export async function paymentMethod(parent, args, context, info) {

    if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

    let entity = await context.prisma.paymentMethod.findUnique({where: {id: args.id,},})
    if(!entity) return { __typename: "InputError", message: `Ce mode de livraison n'éxiste pas.`,};

    return { __typename: "PaymentMethod", ...entity,};

  }