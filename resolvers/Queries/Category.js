
export async function categories(parent, args, context, info) {

    const skip = args.page && args.take ? (args.page - 1) * args.take : 0

    const where = args.filter
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
  
    const categories = await context.prisma.category.findMany({
      where,
      include: {
        parent: true,
        childs: true
      },
      skip: skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    const count = await context.prisma.category.count({
      where: { parent: null}
    })

    const countSub = await context.prisma.category.count({
      where: { parentId: {not: null,}}
    })

    return {count, countSub, categories}
  
}

export async function subCategories(parent, args, context, info) {

  const skip = args.page && args.take ? (args.page - 1) * args.take : 0

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


  const categories = await context.prisma.category.findMany({
    where,
    include: {
      parent: true,
      childs: true
    },
    skip: skip,
    take: args.take,
    orderBy: args.orderBy,
  })

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

  let entity =  await context.prisma.category.findUnique({where: {id: args.id,}, include: {parent: true, childs: true},})
  if(!entity) return { __typename: "InputError", message: `Cette catégorie n'éxiste pas.`,};
   
  return { __typename: "Category", ...entity,};
}
