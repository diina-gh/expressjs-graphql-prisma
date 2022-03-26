import { PrismaSelect } from '@paljs/plugins';

export async function districts(parent, args, context, info) {

    const where = args.filter
    ? {
      OR: [
        { name: { contains: args.filter } },
        { region: {
          name: {contains: args.filter,},
          code: {contains: args.filter,},
        },
      }
      ],
    }
    : {}
  
    const selectedFields = new PrismaSelect(info).valueOf('districts');
    const skip = args.page && args.take ? (args.page - 1) * args.take : 0

    var query = {where, select: selectedFields.select, skip: skip,}
    
    if(args.take) query.take = args.take
    if(args.orderBy) query.orderBy = args.orderBy
  
    const districts = await context.prisma.district.findMany(query)
    const count = await context.prisma.district.count()
    const countRegions = await context.prisma.region.count()
    const countCountries = await context.prisma.country.count()

    return {count, countRegions, countCountries, districts}
  
  }
  
  export async function district(parent, args, context, info) {

    if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

    let entity = await context.prisma.district.findUnique({where: {id: args.id,},include: {region: {include:{country:true}}},})
    if(!entity) return { __typename: "InputError", message: `Cette zone n'éxiste pas.`,};
   
    return { __typename: "District", ...entity,};
  }