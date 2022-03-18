export async function saveDistrict(parent, args, context, info) {
    
  if(args.name == null || args.name == '') return { __typename: "InputError", message: `Veuillez donner le nom du quartier 😣`,};
  if(args.shipping == null) return { __typename: "InputError", message: `Veuillez donnez le prix de livraison pour ce quartier 😧`,};
  if(args.regionId == null) return { __typename: "InputError", message: `Veuillez sélectionner une région 😌`,};
  
  var query0 = { id: args.id }
  var query1 = { id: args.regionId }
  var query2 = { name: args.name, regionId:args.regionId }
  var query3 = {not: args.id,}

  if(args.id != null){
    let district = await context.prisma.district.findUnique({ where: query0 })
    if (!district) return { __typename: "InputError", message: `Ce quartier n'éxiste pas 😪`,};
    query2.id = query3;
  }

  let row = await context.prisma.region.findUnique({ where: query1 })
  if(!row) return { __typename: "InputError", message: `Cette région n'éxiste pas 😫`,};

  let row2 = await context.prisma.district.findFirst({ where: query2 })
  if(row2 != null) return { __typename: "InputError", message: `Ce nom est déjà attribué à un quartier de la région sélectionnée 😠`,};

  const date = new Date()
  const data= {name: args.name, shipping: args.shipping, regionId: args.regionId}

  let district = args.id ? 
            await context.prisma.district.update({where: {id:args.id}, data: {...data, updatedat: date}}) :
            await context.prisma.district.create({data: data})

  return { __typename: "District", ...district,};

}

export async function deleteDistrict(parent, args, context, info){

  if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant 😣`,};

  let entity = await context.prisma.district.findUnique({ where: { id: args.id } })
  if(!entity) return { __typename: "InputError", message: `Ce quartier n'éxiste pas 😪`,};

  let districtsOnUsers = await context.prisma.districtsOnUsers.findFirst({where: { districtId: args.id}})
  if(districtsOnUsers) return { __typename: "InputError", message: `Ce quartier est déjà lié à des clients. Sa suppression pourrait entraîner des incohérences dans le système 😔`,};

  let order = await context.prisma.order.findFirst({where: { districtId: args.id}})
  if(order) return { __typename: "InputError", message: `Ce quartier est déjà lié à des commandes. Sa suppression pourrait entraîner des incohérences dans le système 😔`,};
    
  const deletedEntity = await context.prisma.district.delete({where: {id: args.id,},})
  return { __typename: "District", ...deletedEntity,};
  
}

