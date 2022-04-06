import { PrismaSelect } from '@paljs/plugins';

export async function products(parent, args, context, info) {

    const where = args.filter && args.filter.length > 1
    ? {
      OR: [
        { name: { contains: args.filter } },
        { desc: { contains: args.filter } },
        { unit: { contains: args.filter } },
        { gender: { contains: args.filter } },
      ],
    }
    : {}

    const selectedFields = new PrismaSelect(info).valueOf('products');
    const skip = args.page && args.take ? (args.page - 1) * args.take : 0
    var query = {where, select: selectedFields.select, skip: skip,}
    
    if(args.take) query.take = args.take
    if(args.orderBy) query.orderBy = args.orderBy
  
    const products = await context.prisma.product.findMany(query)
    const count = await context.prisma.product.count({where})
    return {count, products}
  
  }
  
export async function product(parent, args, context, info) {

  if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

  const selectedFields = new PrismaSelect(info).valueWithFilter('Product');

  let entity =  await context.prisma.product.findUnique({where: {id: args.id,}, select: selectedFields.select})
  if(!entity) return { __typename: "InputError", message: `Ce produit n'éxiste pas.`,};

  return { __typename: "Product", ...entity,};
}