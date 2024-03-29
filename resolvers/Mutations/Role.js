export async function saveRole(parent, args, context, info) {

  var query0 = { id: args.id }; var query1 = { name: args.name };  var query2 = {not: args.id,};

  if(args.id != null){
    let permission = await context.prisma.role.findUnique({ where: query0, select:{id:true} })
    if (!permission) return { __typename: "InputError", message: `Ce role n'éxiste pas`,}; 
    query1.id = query2
  }
    
  if(args.name == null || args.name == '') return { __typename: "InputError", message: `Veuillez donner une désignation`,};
  if(args.desc == null || args.desc == '') return { __typename: "InputError", message: `Veuillez donner une description`,};
  if(args.permissions == null || args.permissions?.length <= 0) return { __typename: "InputError", message: `Veuillez sélectionner des permissions pour ce role`,};

  let row = await context.prisma.role.findFirst({ where: query1 })
  if(row) return { __typename: "InputError", message: `Ce role éxiste déjà. Veuillez choisir un autre nom`,};

  for (let i = 0; i < args.permissions.length; i++) {
      let row = await context.prisma.permission.findUnique({ where: { id: args.permissions[i] }, select:{id: true} })
      if(!row) return { __typename: "InputError", message: `Certaines des permissions sélectionnées n'éxistent pas au niveau de la base de données`,};
  }

  var links = []
  const date = new Date()
  const data= {name: args.name, desc: args.desc, permissions: {}}

  if(args.id != null) await context.prisma.PermissionsOnRoles.deleteMany({where: {roleId: args.id}})
  
  for (let i = 0; i < args.permissions.length; i++) {
    links.push({ assignedAt: date, assignedById: 0, permission: { connect: {id:args.permissions[i]}}});
  }

  data.permissions.create = links

  let role = args.id ? 
    await context.prisma.role.update({where: {id:args.id}, data: {...data, updatedat: date}}) :
    await context.prisma.role.create({data: data})

  return { __typename: "Role", ...role,};

}

export async function deleteRole(parent, args, context, info){

  if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

  let entity = await context.prisma.role.findUnique({ where: { id: args.id } })
  if(!entity) return { __typename: "InputError", message: `Ce role n'éxiste pas`,};
 
  let entity2 = await context.prisma.rolesOnUsers.findFirst({ where: { roleId: args.id } })
  if(entity2 != null ) return { __typename: "InputError", message: `Ce role est liée à des utilisateurs`,};

  const deletedEntity = await context.prisma.role.delete({where: {id: args.id,},})
  return { __typename: "Role", ...deletedEntity,};
  
}

