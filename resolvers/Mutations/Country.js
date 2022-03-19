export async function saveCountry(parent, args, context, info) {
    
  if(args.iso3 == null || args.iso3.length != 3) return { __typename: "InputError", message: `Veuillez donner le code iso3 (le code iso3 d'un pays doit comporter 3 charactères) 😣`,};
  if(args.isoNum == null || args.isoNum.length > 3) return { __typename: "InputError", message: `Veuillez donner le code iso numérique (le code iso numérique doit comporter au maximum 3 charactères) 😣`,};
  if(args.name == null || args.name == '') return { __typename: "InputError", message: `Veuillez donner le nom du pays 😌`,};

  var query0 = { id: args.id }; var query1 = { iso3: args.iso3 }; var query2 = { isoNum: args.isoNum }; var query3 = { name: args.name }; var query4 = {not: args.id,};

  if(args.id != null){
    let country = await context.prisma.country.findUnique({ where: query0 })
    if (!country) return { __typename: "InputError", message: `Ce pays n'éxiste pas`,};
    query1.id = query4; query2.id = query4; query3.id = query4;
  } 

  let row = await context.prisma.country.findFirst({ where: query1 })
  if(row) return { __typename: "InputError", message: `Ce code iso3 est déjà attribué à un pays`,};

  let row2 = await context.prisma.country.findFirst({ where: query2 })
  if(row2) return { __typename: "InputError", message: `Ce code iso numérique est déjà attribué à un pays`,};

  let row3 = await context.prisma.country.findFirst({ where: query3 })
  if(row3) return { __typename: "InputError", message: `Ce nom est déjà attribué à un pays`,};

  const date = new Date()
  const data= {iso3: args.iso3, isoNum: args.isoNum, name: args.name}

  let country = args.id ? 
            await context.prisma.country.update({where: {id:args.id}, data: {...data, updatedat: date}}) :
            await context.prisma.country.create({data: data})

  return { __typename: "Country", ...country,};

}

export async function deleteCountry(parent, args, context, info){

  if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant 😣`,};

  let entity = await context.prisma.country.findUnique({ where: { id: args.id } })
  if(!entity) return { __typename: "InputError", message: `Ce pays n'éxiste pas 😔`,};

  let region = await context.prisma.region.findFirst({where: { countryId: args.id}})
  if(region) return { __typename: "InputError", message: `Ce pays est lié à des régions 😔`,};
    
  const deletedEntity = await context.prisma.country.delete({where: {id: args.id,},})
  return { __typename: "Country", ...deletedEntity,};
  
}