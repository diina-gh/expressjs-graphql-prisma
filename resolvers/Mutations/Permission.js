export async function savePermission(parent, args, context, info) {
    
  if(args.name == null) return { __typename: "InputError", message: `Veuillez donner une désignation`,};
  if(args.desc == null) return { __typename: "InputError", message: `Veuillez donner une description`,};

  var query0 = { id: args.id }; var query1 = { name: args.name };  var query2 = {not: args.id,};

  if(args.id != null){
    let permission = await context.prisma.permission.findUnique({ where: query0, select:{id:true} })
    if (!permission) return { __typename: "InputError", message: `Cette permission n'éxiste pas`,}; 
    query1.id = query2
  }

  let row = await context.prisma.country.findFirst({ where: query1 })
  if(row) return { __typename: "InputError", message: `Cette permission éxiste déjà. Veuillez choisir un autre nom`,};

  const date = new Date()
  const data= {name: args.name,desc: args.desc }

  let permission = args.id ? 
      await context.prisma.permission.update({where: {id:args.id}, data: {...data, updatedat: date}}) :
      await context.prisma.permission.create({data: data})

  return { __typename: "Permission", ...permission,};

}

export async function deletePermission(parent, args, context, info){

  if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

  let entity = await context.prisma.permission.findUnique({ where: { id: args.id }, select:{id: true} })
  if(!entity) return { __typename: "InputError", message: `Cette permission n'éxiste pas`,};
    
  const deletedEntity = await context.prisma.permission.delete({where: {id: args.id,},})
  return { __typename: "Permission", ...deletedEntity,};
  
}

