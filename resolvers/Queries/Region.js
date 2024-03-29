import { PrismaSelect } from '@paljs/plugins';

export async function regions(parent, args, context, info) {

    const where = args.filter && args.filter.length > 1
    ? {
      OR: [
        { name: { contains: args.filter } },
        { code: { contains: args.filter } },
        { country: {
            name: {contains: args.filter,},
            iso3: {contains: args.filter,},
            isoNum: {contains: args.filter,},
            },
        }
      ],
    }
    : {}

    const skip = args.page && args.take ? (args.page - 1) * args.take : 0
    var query = {where, include: {country: true, districts: true,}, skip: skip,}
    
    if(args.take) query.take = args.take
    if(args.orderBy) query.orderBy = args.orderBy

    const regions = await context.prisma.region.findMany(query)
    const count = await context.prisma.region.count()

    return {count, regions}
  
  }
  
  export async function region(parent, args, context, info) {

    if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

    let entity = await context.prisma.region.findUnique({where: {id: args.id,}, include: {country: true, districts: true,},})
    if(!entity) return { __typename: "InputError", message: `Cette région n'éxiste pas.`,};
   
    return { __typename: "Region", ...entity,};
  }
  