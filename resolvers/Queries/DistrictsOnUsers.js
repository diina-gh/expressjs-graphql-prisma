
export async function districtsOnUsers(parent, args, context, info) {

    var where = {}

    if(args.userId != null){
        where = {userId: args.userId}
    }
    else{
        where = args.filter
        ? {
          OR: [
            { name: { contains: args.filter } },
            { region: {
                name: {contains: args.filter,},
                code: {contains: args.filter,},
              },
            },
          ],
          
        }
        : {}
    }

    const items = await context.prisma.districtsOnUsers.findMany({
      where,
      include: {user: true, district: {include:{region:{include:{country:true}}}}},
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy,
    })
  
    return items
  
  }
  
  export async function districtsOnUser(parent, args, context, info) {
    return await prisma.districtsOnUsers.findUnique({
        where: {id: args.id,},
        include: {user: true, district: {include:{region:{include:{country:true}}}}},
    })
  }