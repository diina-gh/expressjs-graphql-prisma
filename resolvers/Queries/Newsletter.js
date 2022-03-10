
export async function newsletters(parent, args, context, info) {

  const skip = args.page && args.take ? (args.page - 1) * args.take : 0

  const count = await context.prisma.category.count()

  const where = args.filter
  ? {
    OR: [
      { email: { contains: args.filter } },
      // { url: { contains: args.filter } },
    ],
  }
  : {}

  const items = await context.prisma.newsletter.findMany({
    where,
    skip: skip,
    take: args.take,
    orderBy: args.orderBy,
  })

  return items.map(obj=> ({ ...obj, count }))

}

export async function newsletter(parent, args, context, info) {
    return await prisma.newsletter.findUnique({
        where: {
          id: args.id,
        }
      })
}