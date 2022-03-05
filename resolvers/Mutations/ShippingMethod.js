import { UserInputError} from "apollo-server-express";

export async function saveShippingMethod(parent, args, context, info) {
    
    if(args.name == null ) throw new UserInputError("Veuillez donner une désignation.", {cstm_code: 'E3192013'});
    if(args.code == null ) throw new UserInputError("Veuillez donner un code.", {cstm_code: 'E3192013'});
    if(args.desc == null ) throw new UserInputError("Veuillez donner une description.", {cstm_code: 'E3192013'});

    var query0 = { id: args.id }
    var query1 = { code: args.iso3 }
    var query2 = { id: {not: args.id,}}

    if(args.id != null) query1.push(query2)

    let row = await context.prisma.shippingMethod.findUnique({ where: query1 })
    if(row) throw new UserInputError("Ce code est déjà attribué à un mode de livraison.", {cstm_code: 'E3192013'});

    if(args.id != null){
        let shippingMethod = await context.prisma.shippingMethod.findUnique({ where: query0 })
        if (!shippingMethod) throw new UserInputError("Ce mode de livraison n'éxiste pas.", {cstm_code: 'E3192013'});
    }

    const date = new Date()
    const data= {name: args.name, code: args.code, desc: args.desc}

    let shippingMethod = args.id ? 
            await context.prisma.shippingMethod.update({data: {...data, updatedat: date}}) :
            await context.prisma.shippingMethod.create({data: data})

    return shippingMethod
}

export async function deleteShippingMethod(parent, args, context, info){

  let entity = await context.prisma.shippingMethod.findUnique({ where: { id: args.id } , include: {regions:true}})
  if(!entity) throw new UserInputError("Ce mode de livraison n'éxiste pas.", {cstm_code: 'E3192013'});
    
  const deletedEntity = await context.prisma.shippingMethod.delete({where: {id: args.id,},})
  return deletedEntity
  
}

