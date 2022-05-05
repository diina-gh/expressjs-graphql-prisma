import { PrismaSelect } from '@paljs/plugins';

export async function saveFaq(parent, args, context, info) {

  if(args.id != null){
    let faq = await context.prisma.faq.findUnique({ where: {id: args.id} })
    if (!faq) return { __typename: "InputError", message: `Cette marque n'éxiste pas.`,};
  }
    
  if(args.question == null || args.question == '') return { __typename: "InputError", message: `Veuillez saisir une question.`,};
  if(args.answer == null || args.answer == '') return { __typename: "InputError", message: `Veuillez saisir la réponse.`,};
  if(args.order == null || args.order == 0) return { __typename:"InputError", message: `Veuillez donner un ordre`,};
  
  const date = new Date()
  var data = {question: args.question,answer: args.answer, order:args.order }

  let faq = args.id ? 
    await context.prisma.faq.update({where: {id:args.id}, data: {...data, updatedat: date}}) :
    await context.prisma.faq.create({data: data})
  
  return { __typename: "Faq", ...faq,};
}

export async function deleteFaq(parent, args, context, info){

  if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

  let entity = await context.prisma.faq.findUnique({ where: { id: args.id } })
  if(!entity) return { __typename: "InputError", message: `Cette question n'éxiste pas.`,};
 
  const deletedEntity = await context.prisma.faq.delete({where: {id: args.id,},})
  return { __typename: "Faq", ...deletedEntity,};

}

