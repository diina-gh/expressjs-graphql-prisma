export async function createNewsletter(parent, args, context, info) {
    
    let email = await context.prisma.newsletter.findUnique({ where: { email: args.email } })

    if (email) {
      throw new Error('Vous vous etes déjà inscrit(e) à notre newsletter.')
    }
  
    let newsletter = await context.prisma.newsletter.create({
      data: {
        email: args.email,
      }
    })

    return newsletter
    
  }
