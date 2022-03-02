
export async function products(parent, args, context, info) {

    const where = args.filter
    ? {
      OR: [
        { name: { contains: args.filter } },
        { short_desc: { contains: args.filter } },
      ],
    }
    : {}
  
    const items = await context.prisma.product.findMany({
      where,
      include: {variants: {include:{variant:true}}, options: {include:{option:true}}, images: true},
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    return items
  
  }
  
  export async function product(parent, args, context, info) {
    return await prisma.product.findUnique({
        where: {id: args.id,},
        include: {variants: {include:{variant:true}}, options: {include:{option:true}}, images: true},
    })
  }