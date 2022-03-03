import { UserInputError} from "apollo-server-express";

export async function saveCountry(parent, args, context, info) {
    
  if(args.iso3 == null || args.iso3.length != 3){
    throw new UserInputError("Veuillez donner le code iso3 (le code iso3 d'un pays doit comporter 3 charactère).", {cstm_code: 'E3192013'});
  }
  else if(args.isoNum == null || args.isoNum.length > 3){
    throw new UserInputError("Veuillez donner le code iso numérique (le code iso numérique doit comporter au maximum 3 charactère).", {cstm_code: 'E3192013'});
  }
  else if(args.name == null || args.name == ''){
    throw new UserInputError("Veuillez donner le nom du pays.", {cstm_code: 'E3192013'});
  }

  else {

    var query0 = { id: args.id }
    var query1 = { iso3: args.iso3 }
    var query2 = { isoNum: args.isoNum }
    var query3 = { name: args.name }
    var query4 = { id: {not: args.id,}}
    if(args.id != null) query1.push(query4) && query2.push(query4) && query3.push(query4);

    let row = await context.prisma.country.findUnique({ where: query1 })
    if(row) throw new UserInputError("Ce code iso3 est déjà attribué à un pays.", {cstm_code: 'E3192013'});

    let row2 = await context.prisma.country.findUnique({ where: query2 })
    if(row2) throw new UserInputError("Ce code iso numérique est déjà attribué à un pays", {cstm_code: 'E3192013'});

    let row3 = await context.prisma.country.findUnique({ where: query3 })
    if(row3) throw new UserInputError("Ce nom est déjà attribué à un pays", {cstm_code: 'E3192013'});
 
    if(args.id != null){
      let country = await context.prisma.country.findUnique({ where: query0 })
      if (!country) throw new UserInputError("Ce pays n'éxiste pas.", {cstm_code: 'E3192013'});
    }

  }

  const date = new Date()
  const data= {iso3: args.iso3, isoNum: args.isoNum, name: args.name}

  let country = args.id ? 
            await context.prisma.country.update({data: {...data, updatedat: date}}) :
            await context.prisma.country.create({data: data})
  return country

}

export async function deleteCountry(parent, args, context, info){

  let entity = await context.prisma.country.findUnique({ where: { id: args.id } , include: {regions:true}})

  if(!entity) throw new UserInputError("Ce pays n'éxiste pas.", {cstm_code: 'E3192013'});
  if(entity.regions != null && entity.regions.length > 0) throw new UserInputError("Ce pays est liée à des régions.", {cstm_code: 'E3192013'});
    
  const deletedEntity = await context.prisma.country.delete({where: {id: args.id,},})
  return deletedEntity
  
}

