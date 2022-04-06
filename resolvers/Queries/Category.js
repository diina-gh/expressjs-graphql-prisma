import { PrismaSelect } from '@paljs/plugins';

export async function categories(parent, args, context, info) {

    const where = args.filter && args.filter.length > 1
    ? {
      OR: [
        { name: { contains: args.filter } },
        { desc: { contains: args.filter } },
        { long_desc: { contains: args.filter } },
        { parent: null}
      ],
    }
    :
    { parent: null}

    const selectedFields = new PrismaSelect(info).valueOf('categories');
    const skip = args.page && args.take ? (args.page - 1) * args.take : 0
    var query = {where, select: selectedFields.select, skip: skip,}
    
    if(args.take) query.take = args.take
    if(args.orderBy) query.orderBy = args.orderBy
  
    const categories = await context.prisma.category.findMany(query)
  
    const count = await context.prisma.category.count({where: { parent: null}})

    const countSub = await context.prisma.category.count({where: { parentId: {not: null,}}})

    return {count, countSub, categories}
  
}

export async function subCategories(parent, args, context, info) {

  const where = args.filter
  ? {
    OR: [
      { name: { contains: args.filter } },
      { desc: { contains: args.filter } },
      { long_desc: { contains: args.filter } },
      { parentId: {not: null,}}
    ],
  }
  :
  { parentId: {not: null,}}

  const selectedFields = new PrismaSelect(info).valueOf('categories');
  const skip = args.page && args.take ? (args.page - 1) * args.take : 0
  var query = {where, select: selectedFields.select, skip: skip,}
  
  if(args.take) query.take = args.take
  if(args.orderBy) query.orderBy = args.orderBy

  const categories = await context.prisma.category.findMany(query)

  const count = await context.prisma.category.count({
    where: { parent: null}
  })

  const countSub = await context.prisma.category.count({
    where: { parentId: {not: null,}}
  })

  return {count, countSub, categories}

}
  
export async function category(parent, args, context, info) {

  if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

  const selectedFields = new PrismaSelect(info).valueWithFilter('Category');

  let entity =  await context.prisma.category.findUnique({where: {id: args.id,}, select: selectedFields.select})
  if(!entity) return { __typename: "InputError", message: `Cette catégorie n'éxiste pas.`,};
   
  return { __typename: "Category", ...entity,};
}
