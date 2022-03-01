import { UserInputError} from "apollo-server-express";

export async function saveVariant(parent, args, context, info) {
    
  if(args.title == null){
    throw new UserInputError("Veuillez donner une désignation.", {cstm_code: 'E3192013'});
  }
  else if(args.desc == null){
    throw new UserInputError("Veuillez donner une description.", {cstm_code: 'E3192013'});
  }
  else if(args.options == null || args.options?.length <= 0){
    throw new UserInputError("Veuillez ajoutez des options pour ce variant.", {cstm_code: 'E3192013'});
  }
  
  else {

    for (let i = 0; i < args.options.length; i++) {
        if(args.options[i].value == null || args.options[i].value == '') throw new UserInputError("Veuillez donner la valeur de l'option " + (i+1), {cstm_code: 'E3192013'});
        if( args.title.toLowerCase().includes("couleur") && (args.options[i].colorCode == null || args.options[i].colorCode == '')) throw new UserInputError("Veuillez donner le code couleur de l'option " + i, {cstm_code: 'E3192013'});
    }

    if(args.id == null){
      let variant = await context.prisma.variant.findUnique({ where: { title: args.title } })
      if (variant) throw new UserInputError("Ce variant éxiste déjà. Veuillez choisir un autre nom", {cstm_code: 'E3192013'});
    }

    else{
      let variant = await context.prisma.variant.findUnique({ where: { id: args.id } })
      if (!variant) throw new UserInputError("Ce variant n'éxiste pas.", {cstm_code: 'E3192013'});
    }
  }

  const date = new Date()
  const data= {title: args.title, desc: args.desc, options: {create: args.options}}

  let variant = args.id ? 
            await context.prisma.variant.update({data: {...data, updatedat: date}}) :
            await context.prisma.variant.create({data: data})
  return variant
}

export async function deleteVariant(parent, args, context, info){

  let entity = await context.prisma.variant.findUnique({ where: { id: args.id } })

  if(!entity){
    throw new UserInputError("Ce variant n'éxiste pas.", {cstm_code: 'E3192013'});
  }
  else if(entity){
    let entity2 = await context.prisma.variantsOnProducts.findMany({ where: { variantId: args.id } })
    if(entity2 != null && entity2.length > 0) throw new UserInputError("Ce variant est liée à des produits.", {cstm_code: 'E3192013'});
  }
    
  const deletedEntity = await context.prisma.variant.delete({where: {id: args.id,},})
  return deletedEntity
  
}

