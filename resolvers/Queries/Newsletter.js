
export async function newsletters(parent, args, context, info) {

    const where = args.filter
    ? {
      OR: [
        { email: { contains: args.filter } },
        // { url: { contains: args.filter } },
      ],
    }
    : {}

    let items = await context.prisma.newsletter.findMany({
        where,
    })

    return items
}

export async function newsletter(parent, args, context, info) {
    return await prisma.newsletter.findUnique({
        where: {
          id: args.id,
        }
      })
}