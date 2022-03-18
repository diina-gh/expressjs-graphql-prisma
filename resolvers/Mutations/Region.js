export async function saveRegion(parent, args, context, info) {
    
  if(args.code == null || args.code.length != 2) return { __typename: "InputError", message: `Veuillez donner le code (le code d'une région doit comporter 2 charactère)`,};
  if(args.name == null || args.name == '') return { __typename: "InputError", message: `Veuillez donner le nom de la région`,};
  if(args.countryId == null) return { __typename: "InputError", message: `Veuillez sélectionner un pays`,};

  var query0 = { id: args.id }
  var query1 = { id: args.countryId }
  var query2 = { code: args.code, countryId:args.countryId }
  var query3 = { name: args.name, countryId:args.countryId }
  var query4 = {not: args.id,}

  if(args.id != null){
    let region = await context.prisma.region.findUnique({ where: query0 })
    if (!region) return { __typename: "InputError", message: `Cette région n'éxiste pas`,};
    query2.id = query4; query3.id = query4 ;
  } 

  let row = await context.prisma.country.findUnique({ where: query1 })
  if(!row) return { __typename: "InputError", message: `Ce pays n'éxiste pas`,};

  let rows = await context.prisma.region.findMany({ where: query2 })
  if(rows != null && rows.length > 0) return { __typename: "InputError", message: `Ce code est déjà attribué à une région du pays sélectionné`,};

  let rows2 = await context.prisma.region.findMany({ where: query3 })
  if(rows2 != null && rows2.length > 0) return { __typename: "InputError", message: `Ce nom est déjà attribué à une région du pays sélectionné`,};

  const date = new Date()
  const data= {code: args.code, name: args.name, countryId: args.countryId}

  let region = args.id ? 
            await context.prisma.region.update({where: {id:args.id}, data: {...data, updatedat: date}}) :
            await context.prisma.region.create({data: data})
  
  return { __typename: "Region", ...region,};

}

export async function deleteRegion(parent, args, context, info){

  if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

  let entity = await context.prisma.region.findUnique({ where: { id: args.id } })
  if(!entity) return { __typename: "InputError", message: `Cette région n'éxiste pas`,};

  let district = await context.prisma.district.findFirst({where: { regionId: args.id}})
  if(district) return { __typename: "InputError", message: `Cette région est liée à des quartiers`,};
    
  const deletedEntity = await context.prisma.region.delete({where: {id: args.id,},})
  return { __typename: "Country", ...deletedEntity,};
  
}

