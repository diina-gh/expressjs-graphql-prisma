export async function saveNewsletter(parent, args, context, info) {
  
  var query0 = { id: args.id }, query1 = { email: args.email}, query2 = {not: args.id,}

  if(args.id != null){
    let newsletter = await context.prisma.newsletter.findUnique({ where: query0 })
    if (!newsletter) return { __typename: "InputError", message: `Cette adresse email n'éxiste pas`,};
    query1.id = query2;
  } 

  if(args.email == null || args.email == '') return { __typename: "InputError", message: `Veuillez donner une adresse email.`,};

  let row = await context.prisma.newsletter.findFirst({ where: query1 })
  if(row) return { __typename: "InputError", message: `Vous vous êtes déjà inscrit(e) à notre newsletter`,};

  const date = new Date()
  var data = {email: args.email,}

  let newsletter = args.id ? 
    await context.prisma.newsletter.update({where: {id:args.id}, data: {...data, updatedat: date}}) :
    await context.prisma.newsletter.create({data: data})

    return { __typename: "Newsletter", ...newsletter,};

}

export async function deleteNewsletter(parent, args, context, info){

  if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

  let entity = await context.prisma.newsletter.findUnique({ where: { id: args.id } })
  if(!entity) return { __typename: "InputError", message: `Cette adresse email n'éxiste pas`,};

  const deletedEntity = await context.prisma.newsletter.delete({where: {id: args.id,},})
  return { __typename: "Newsletter", ...deletedEntity,};

}