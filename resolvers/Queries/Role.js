import { PrismaSelect } from '@paljs/plugins';

export async function roles(parent, args, context, info) {

    const where = args.filter
    ? {
      OR: [
        { name: { contains: args.filter } },
        { desc: { contains: args.filter } },
      ],
    }
    : {}

    const selectedFields = new PrismaSelect(info).valueOf('roles');
    const skip = args.page && args.take ? (args.page - 1) * args.take : 0
    var query = {where, select: selectedFields.select, skip: skip,}
  
    if(args.take) query.take = args.take
    if(args.orderBy) query.orderBy = args.orderBy
  
    const roles = await context.prisma.role.findMany(query)
    const count = await context.prisma.role.count()
    return {count, roles}
  
  }
  
  export async function role(parent, args, context, info) {
    if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

    const selectedFields = new PrismaSelect(info).valueOf('Role');
  
    let entity =  await context.prisma.role.findUnique({where: {id: args.id,}, select: selectedFields.select})
    if(!entity) return { __typename: "InputError", message: `Ce role n'éxiste pas.`,};
  
    return { __typename: "Role", ...entity,};
  }