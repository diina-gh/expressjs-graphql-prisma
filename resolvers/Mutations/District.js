import { UserInputError} from "apollo-server-express";

export async function saveDistrict(parent, args, context, info) {
    
  if(args.name == null || args.name == ''){
    throw new UserInputError("Veuillez donner le nom du quartier.", {cstm_code: 'E3192013'});
  }
  else if(args.shipping == null){
    throw new UserInputError("Veuillez donnez le prix de livraison pour ce quartier.", {cstm_code: 'E3192013'});
  }
  else if(args.countryId == null){
    throw new UserInputError("Veuillez sélectionner une région.", {cstm_code: 'E3192013'});
  }

  else {

    var query0 = { id: args.id }
    var query1 = { id: args.regionId }
    var query2 = { name: args.name, regionId:args.regionId }
    var query3 = { id: {not: args.id,}}
    if(args.id != null) query1.push(query3) && query2.push(query3) && query3.push(query3);

    let row = await context.prisma.region.findUnique({ where: query1 })
    if(!row) throw new UserInputError("Cette région n'éxiste pas.", {cstm_code: 'E3192013'});

    let rows = await context.prisma.district.findMany({ where: query2 })
    if(rows != null && rows.length > 0) throw new UserInputError("Ce nom est déjà attribué à un quartier de la région sélectionnée.", {cstm_code: 'E3192013'});

    if(args.id != null){
      let district = await context.prisma.district.findUnique({ where: query0 })
      if (!district) throw new UserInputError("Ce quartier n'éxiste pas.", {cstm_code: 'E3192013'});
    }

  }

  const date = new Date()
  const data= {name: args.name, shipping: args.shipping, regionId: args.regionId}

  let district = args.id ? 
            await context.prisma.district.update({data: {...data, updatedat: date}}) :
            await context.prisma.district.create({data: data})
  return district

}

export async function deleteDistrict(parent, args, context, info){

  let entity = await context.prisma.district.findUnique({ where: { id: args.id } , include: {users:true, orders: true}})

  if(!entity) throw new UserInputError("Ce quartier n'éxiste pas.", {cstm_code: 'E3192013'});
  if((entity.users != null && entity.users.length > 0) || (entity.orders != null && entity.orders.length > 0) ) throw new UserInputError("Ce quartier est déjà lié à des clients ou à des commandes. Sa suppression pourrait entraîner des incohérences dans le système.", {cstm_code: 'E3192013'});
    
  const deletedEntity = await context.prisma.district.delete({where: {id: args.id,},})
  return deletedEntity
  
}

