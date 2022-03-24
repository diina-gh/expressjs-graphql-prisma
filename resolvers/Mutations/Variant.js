import { PrismaSelect } from '@paljs/plugins';

export async function saveVariant(parent, args, context, info) {
    
  if(args.name == null || args.name == '') return { __typename: "InputError", message: `Veuillez donner une désignation`,};
  if(args.desc == null || args.desc == '') return { __typename: "InputError", message: `Veuillez donner une description`,};
  if(args.options == null || args.options?.length <= 0)  return { __typename: "InputError", message: `Veuillez ajoutez des options pour ce variant`,};

  var query0 = { id: args.id }
  var query1 = { name: args.name.toLowerCase() }
  var query2 = {not: args.id,}

  if(args.id != null){
    let variant = await context.prisma.variant.findUnique({ where: query0 })
    if (!variant) return { __typename: "InputError", message: `Ce variant n'éxiste pas`,};
    query1.id = query2;
  } 
 
  for (let i = 0; i < args.options.length; i++) {
      if(args.options[i].value == null || args.options[i].value == '') return { __typename: "InputError", message: `Veuillez donner la valeur de l'option ${i+1}`,}; 
      if( args.name.toLowerCase().includes("couleur") && (args.options[i].colorCode == null || args.options[i].colorCode == '')) return { __typename: "InputError", message: `Veuillez donner le code couleur de l'option ${i+1}`,};
  }

  let row = await context.prisma.variant.findFirst({ where: query1 })
  if (row) return { __typename: "InputError", message: `Ce variant éxiste déjà. Veuillez choisir un autre nom`,};

  const date = new Date()
  const data= {name: args.name.toLowerCase(), desc: args.desc, options: {create: args.options}}

  if(args.id) await context.prisma.option.deleteMany({where: { variantId: args.id },})

  let variant = args.id ? 
            await context.prisma.variant.update({where: {id:args.id}, data: {...data, updatedat: date}}) :
            await context.prisma.variant.create({data: data})

  return { __typename: "Variant", ...variant,};

}

export async function deleteVariant(parent, args, context, info){

  if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

  let entity = await context.prisma.variant.findUnique({ where: { id: args.id } })
  if(!entity) return { __typename: "InputError", message: `Ce variant n'éxiste pas`,};

  let variantsOnProducts = await context.prisma.variantsOnProducts.findFirst({ where: { variantId: args.id } })
  if(variantsOnProducts) return { __typename: "InputError", message: `Ce variant est lié à des produits`,};
  
  const deletedEntity = await context.prisma.variant.delete({where: {id: args.id,},})
  return { __typename: "Variant", ...deletedEntity,};

}

