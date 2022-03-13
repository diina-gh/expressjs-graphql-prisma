import { UserInputError} from "apollo-server-express";

export async function saveBrand(parent, args, context, info) {
    
  if(args.name == null) throw new UserInputError("Veuillez donner un nom.", {cstm_code: 'E3192013'});
    
  if(args.order == null) throw new UserInputError("Veuillez donner un ordre.", {cstm_code: 'E3192013'});

//   if(args.imageId == null) throw new UserInputError("Veuillez choisir une image.", {cstm_code: 'E3192013'});

//   let image = await context.prisma.image.findUnique({ where: {id: args.imageId} })
//   if(!image) throw new UserInputError("Veuillez choisir une image.", {cstm_code: 'E3192013'});

  if(args.id != null){
    let brand = await context.prisma.brand.findUnique({ where: {id: args.id} })
    if (!brand) throw new UserInputError("Cette marque n'éxiste pas.", {cstm_code: 'E3192013'});
  }
  
  const date = new Date()
  var data = {name: args.name,desc: args.desc, order:args.order, order:args.order, imageId: args.imageId  }

  let brand = args.id ? 

    await context.prisma.brand.update({data: {...data, updatedat: date}}) :
    await context.prisma.brand.create({data: data})
  
  return brand
}

export async function deleteBrand(parent, args, context, info){

  let entity = await context.prisma.brand.findUnique({ where: { id: args.id } })

  if(!entity){
    throw new UserInputError("Cette marque n'éxiste pas.", {cstm_code: 'E3192013'});
  }

  else{
    const deletedEntity = await context.prisma.brand.delete({where: {id: args.id,},})
    return deletedEntity
  }

}

