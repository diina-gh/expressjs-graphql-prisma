import { PrismaSelect } from '@paljs/plugins';

export async function users(parent, args, context, info) {

    const where = args.filter
    ? {
      OR: [
        { firstname: { contains: args.filter } },
        { lastname: { contains: args.filter } },
        { email: { contains: args.filter } },
        { customer: false}
      ],
    }
    : 
    {customer: false}

    const selectedFields = new PrismaSelect(info).valueOf('users');
    const skip = args.page && args.take ? (args.page - 1) * args.take : 0
    var query = {where, select: selectedFields.select, skip: skip,}
  
    if(args.take) query.take = args.take
    if(args.orderBy) query.orderBy = args.orderBy
  
    const users = await context.prisma.user.findMany(query)
    const count = await context.prisma.user.count({where: { customer: false}})
    return {count, users}
  
}

export async function clients(parent, args, context, info) {

  const where = args.filter
  ? {
    OR: [
      { firstname: { contains: args.filter } },
      { lastname: { contains: args.filter } },
      { email: { contains: args.filter } },
      { customer: true}

    ],
  }
  : 
  {customer: true}

  const selectedFields = new PrismaSelect(info).valueOf('users');
  const skip = args.page && args.take ? (args.page - 1) * args.take : 0
  var query = {where, select: selectedFields.select, skip: skip,}

  if(args.take) query.take = args.take
  if(args.orderBy) query.orderBy = args.orderBy

  const users = await context.prisma.user.findMany(query)
  const count = await context.prisma.user.count({where: { customer: true}})
  return {count, users}

}
  
export async function user(parent, args, context, info) {
    if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

    const selectedFields = new PrismaSelect(info).valueWithFilter('User');
  
    let entity =  await context.prisma.user.findUnique({where: {id: args.id,}, select: selectedFields.select})
    if(!entity) return { __typename: "InputError", message: `Cet utilisateur n'éxiste pas.`,};
  
    return { __typename: "User", ...entity,};
}