import { PrismaSelect } from '@paljs/plugins';

export async function products(parent, args, context, info) {

    const where = args.filter
    ? {
      OR: [
        { name: { contains: args.filter } },
        { desc: { contains: args.filter } },
        { category: {
          name: {contains: args.filter,},
          desc: {contains: args.filter,},
          },
        }
      ],
    }
    : {}

    const selectedFields = new PrismaSelect(info).valueOf('products');
    const skip = args.page && args.take ? (args.page - 1) * args.take : 0
    var query = {where, select: selectedFields.select, skip: skip,}

    // var query = {where, include: {variants: {include:{variant:true}}, options: {include:{option:true}}, category: { include: {parent: true}} , brand: true, inventory: true, images: true,}, skip: skip,}
    
    if(args.take) query.take = args.take
    if(args.orderBy) query.orderBy = args.orderBy
  
    const products = await context.prisma.product.findMany(query)
    const count = await context.prisma.product.count()
    return {count, products}
  
  }
  
export async function product(parent, args, context, info) {

  if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

  const selectedFields = new PrismaSelect(info).value;

  let entity =  await context.prisma.product.findUnique({where: {id: args.id,}, select: selectedFields.select})
  if(!entity) return { __typename: "InputError", message: `Ce produit n'éxiste pas.`,};

  return { __typename: "Product", ...entity,};
}