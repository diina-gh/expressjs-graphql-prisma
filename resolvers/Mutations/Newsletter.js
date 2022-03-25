import { PrismaSelect } from '@paljs/plugins';
import { UserInputError} from "apollo-server-express";

export async function saveNewsletter(parent, args, context, info) {
    
  if(args.email == null){
    throw new UserInputError("Veuillez renseigner le champ adresse email.", {cstm_code: 'E3192013'});
  }
  else {
    if(args.id == null){
      let email = await context.prisma.newsletter.findUnique({ where: { email: args.email } })
      if (email) throw new UserInputError("Vous vous etes déjà inscrit(e) à notre newsletter.", {cstm_code: 'E3192013'});
    }
    else{
      let email = await context.prisma.newsletter.findUnique({ where: { id: args.id } })
      if (!email) throw new UserInputError("Cette adresse email n'éxiste pas.", {cstm_code: 'E3192013'});
    }
  }

  let newsletter = await context.prisma.newsletter.upsert({
    where: {id: args.id ? args.id : 0,},
    update: {email: args.email},
    create: {email: args.email},
  })
  
  return newsletter
}

export async function deleteNewsletter(parent, args, context, info){

  let entity = await context.prisma.newsletter.findUnique({ where: { id: args.id } })

  if(!entity){
    throw new UserInputError("Cette adresse email n'éxiste pas.", {cstm_code: 'E3192013'});
  }
  else{
    const deletedEntity = await context.prisma.newsletter.delete({where: {id: args.id,},})
    return deletedEntity
  }

}

