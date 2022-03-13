
export async function brands(parent, args, context, info) {

    const skip = args.page && args.take ? (args.page - 1) * args.take : 0

    const where = args.filter
    ? {
      OR: [
        { name: { contains: args.filter } },
        { desc: { contains: args.filter } },
      ],
    }
    :
    { }
  
    const brands = await context.prisma.brand.findMany({
      where,
      include: {
        image: true,
      },
      skip: skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    const count = await context.prisma.brand.count()
    return {count, brands}
  
}

  
export async function brand(parent, args, context, info) {
  return await context.prisma.brand.findUnique({
      where: {id: args.id,},
      include: {image: true},
  })
}