import { UserInputError} from "apollo-server-express";

export async function saveCategory(parent, args, context, info) {
    
  if(args.name == null){
    throw new UserInputError("Veuillez donner un nom.", {cstm_code: 'E-3192013'});
  }
  else if(args.desc == null){
    throw new UserInputError("Veuillez donner une description.", {cstm_code: 'E-3192013'});
  }
  else if(args.order == null){
    throw new UserInputError("Veuillez donner un ordre.", {cstm_code: 'E-3192013'});
  }
  else {
    if(args.id == null){
      let category = await context.prisma.category.findUnique({ where: { name: args.name } })
      if (category) throw new UserInputError("Cette catégorie éxiste déjà. Veuillez choisir un autre nom", {cstm_code: 'E-3192013'});
    }
    else{
      let category = await context.prisma.category.findUnique({ where: { id: args.id } })
      if (!category) throw new UserInputError("Cette catégorie n'éxiste pas.", {cstm_code: 'E-3192013'});
    }
  }

  const date = new Date()

  const data= {name: args.name,desc: args.desc, long_desc:args.long_desc, order:args.order,parent:{connect:{id: args.parentId}} }

  let category = await context.prisma.category.upsert({
    where: {id: args.id ? args.id : 0,},
    update: {...data, updatedat: date},
    create: data
  })
  
  return category
}

export async function deleteCategory(parent, args, context, info){

  let entity = await context.prisma.category.findUnique({ where: { id: args.id } })

  if(!entity){
    throw new UserInputError("Cette catégorie n'éxiste pas.", {cstm_code: 'E-3192013'});
  }
  else{
    const deletedEntity = await context.prisma.category.delete({where: {id: args.id,},})
    return deletedEntity
  }

}

