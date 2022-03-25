import { PrismaSelect } from '@paljs/plugins';

export async function users(parent, args, context, info) {

    const where = args.filter
    ? {
      OR: [
        { email: { contains: args.filter } },
        { firtname: { contains: args.filter } },
        { lastname: { contains: args.filter } },
        { phonenumber: { contains: args.filter } },
      ],
    }
    : {}
  
    const items = await context.prisma.user.findMany({
      where,
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    return items
  
  }
  
  export async function user(parent, args, context, info) {
    return await prisma.user.findUnique({
        where: {
        id: args.id,
        }
    })
  }