import { UserInputError} from "apollo-server-express";

export async function saveRole(parent, args, context, info) {
    
  if(args.name == null){
    throw new UserInputError("Veuillez donner une désignation.", {cstm_code: 'E3192013'});
  }
  else if(args.desc == null){
    throw new UserInputError("Veuillez donner une description.", {cstm_code: 'E3192013'});
  }
  else if(args.permissions == null || args.permissions?.length <= 0){
    throw new UserInputError("Veuillez sélectionner des permissions pour ce role.", {cstm_code: 'E3192013'});
  }
  
  else {

    for (let i = 0; i < args.permissions.length; i++) {
        let row = await context.prisma.permission.findUnique({ where: { id: args.permissions[i] } })
        if(!row) throw new UserInputError("Certaines des permissions sélectionnées n'éxistent pas.", {cstm_code: 'E3192013'});
    }

    if(args.id == null){
      let role = await context.prisma.role.findUnique({ where: { name: args.name } })
      if (role) throw new UserInputError("Ce role éxiste déjà. Veuillez choisir un autre nom", {cstm_code: 'E3192013'});
    }

    else{
      let role = await context.prisma.role.findUnique({ where: { id: args.id } })
      if (!role) throw new UserInputError("Ce role n'éxiste pas.", {cstm_code: 'E3192013'});
    }
  }

  const date = new Date()

  let links = []

  for (let i = 0; i < args.permissions.length; i++) {
    links.push({ assignedAt: date, assignedById: 0, permission: { connect: {id:args.permissions[i]}}});
  }

  const data= {name: args.name, desc: args.desc, permissions: {create: links}}

  let role = args.id ? 
            await context.prisma.role.update({data: {...data, updatedat: date}}) :
            await context.prisma.role.create({data: data})
  return role
}

export async function deleteRole(parent, args, context, info){

  let entity = await context.prisma.role.findUnique({ where: { id: args.id } })

  if(!entity){
    throw new UserInputError("Ce role n'éxiste pas.", {cstm_code: 'E3192013'});
  }
  else if(entity){
    let entity2 = await context.prisma.rolesOnUsers.findMany({ where: { roleId: args.id } })
    if(entity2 != null && entity2.length > 0) throw new UserInputError("Ce role est liée à des utilisateurs.", {cstm_code: 'E3192013'});
  }
    
  context.prisma.permissionsOnRoles.deleteMany({where: { roleId: args.id },})

  const deletedEntity = await context.prisma.role.delete({where: {id: args.id,},})
  return deletedEntity
  
}

