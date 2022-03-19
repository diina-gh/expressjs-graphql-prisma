import { UserInputError} from "apollo-server-express";

export async function savePermission(parent, args, context, info) {
    
  if(args.name == null){
    throw new UserInputError("Veuillez donner une désignation.", {cstm_code: 'E3192013'});
  }
  else if(args.desc == null){
    throw new UserInputError("Veuillez donner une description.", {cstm_code: 'E3192013'});
  }
  else {
    if(args.id == null){
      let permission = await context.prisma.permission.findUnique({ where: { name: args.name } })
      if (permission) throw new UserInputError("Cette permission éxiste déjà. Veuillez choisir un autre nom", {cstm_code: 'E3192013'});
    }
    else{
      let permission = await context.prisma.permission.findUnique({ where: { id: args.id } })
      if (!permission) throw new UserInputError("Cette permission n'éxiste pas.", {cstm_code: 'E3192013'});
    }
  }

  const date = new Date()
  const data= {name: args.name,desc: args.desc }

  let permission = await context.prisma.permission.upsert({
    where: {id: args.id ? args.id : 0,},
    update: {...data, updatedat: date},
    create: data
  })
  
  return permission
}

export async function deletePermission(parent, args, context, info){

  let entity = await context.prisma.permission.findUnique({ where: { id: args.id } })

  if(!entity){
    throw new UserInputError("Cette permission n'éxiste pas.", {cstm_code: 'E3192013'});
  }
  else if(entity){
    let entity2 = await context.prisma.permissionsOnRoles.findMany({ where: { permissionId: args.id } })
    if(entity2 != null && entity2.length > 0) throw new UserInputError("Cette permission est liée à des roles.", {cstm_code: 'E3192013'});
  }
    
  const deletedEntity = await context.prisma.permission.delete({where: {id: args.id,},})
  return deletedEntity
  
}

