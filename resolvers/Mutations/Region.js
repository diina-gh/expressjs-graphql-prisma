import { UserInputError} from "apollo-server-express";

export async function saveRegion(parent, args, context, info) {
    
  if(args.code == null || args.code.length != 2){
    throw new UserInputError("Veuillez donner le code (le code d'une région doit comporter 2 charactère).", {cstm_code: 'E3192013'});
  }
  else if(args.name == null || args.name == ''){
    throw new UserInputError("Veuillez donner le nom de la région.", {cstm_code: 'E3192013'});
  }
  else if(args.countryId == null){
    throw new UserInputError("Veuillez sélectionner un pays.", {cstm_code: 'E3192013'});
  }

  else {

    var query0 = { id: args.id }
    var query1 = { id: args.countryId }
    var query2 = { code: args.code, countryId:args.countryId }
    var query3 = { name: args.name, countryId:args.countryId }
    var query4 = { id: {not: args.id,}}
    if(args.id != null) query2.push(query4) && query3.push(query4);

    let row = await context.prisma.country.findUnique({ where: query1 })
    if(!row) throw new UserInputError("Ce pays n'éxiste pas.", {cstm_code: 'E3192013'});

    let rows = await context.prisma.region.findMany({ where: query2 })
    if(rows != null && rows.length > 0) throw new UserInputError("Ce code est déjà attribué à une région du pays sélectionné.", {cstm_code: 'E3192013'});

    let rows2 = await context.prisma.region.findMany({ where: query3 })
    if(rows2 != null && rows2.length > 0) throw new UserInputError("Ce nom est déjà attribué à une région du pays sélectionné.", {cstm_code: 'E3192013'});

    if(args.id != null){
      let region = await context.prisma.region.findUnique({ where: query0 })
      if (!region) throw new UserInputError("Cette région n'éxiste pas.", {cstm_code: 'E3192013'});
    }

  }

  const date = new Date()
  const data= {code: args.code, name: args.name, countryId: args.countryId}

  let region = args.id ? 
            await context.prisma.region.update({data: {...data, updatedat: date}}) :
            await context.prisma.region.create({data: data})
  return region

}

export async function deleteRegion(parent, args, context, info){

  let entity = await context.prisma.region.findUnique({ where: { id: args.id } , include: {regions:true}})

  if(!entity) throw new UserInputError("Ce pays n'éxiste pas.", {cstm_code: 'E3192013'});
  if(entity.regions != null && entity.regions.length > 0) throw new UserInputError("Ce pays est liée à des régions.", {cstm_code: 'E3192013'});
    
  const deletedEntity = await context.prisma.region.delete({where: {id: args.id,},})
  return deletedEntity
  
}

