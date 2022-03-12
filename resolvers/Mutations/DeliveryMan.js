import { UserInputError} from "apollo-server-express";

export async function saveDeliveryMan(parent, args, context, info) {
    
    if(args.civility == null) throw new UserInputError("Veuillez donner une civilité.", {cstm_code: 'E3192013'});

    if(args.civility != "MONSIEUR" && args.civility != "MADAME") throw new UserInputError("Veuillez donner une civilité valide.", {cstm_code: 'E3192013'});

    if(args.firstname == null) throw new UserInputError("Veuillez donner un prénom.", {cstm_code: 'E3192013'});
      
    if(args.lastname == null) throw new UserInputError("Veuillez donner un nom.", {cstm_code: 'E3192013'});
      
    if (args.phonenumber == null) throw new UserInputError("Veuillez donner un numéro de téléphone.", {cstm_code: 'E3192013'});
    
    if (args.email == null) throw new UserInputError("Veuillez donner une adresse email.", {custom_code: 'E3192013' });
    
    var query0 = { id: args.id }
    var query1 = { email: args.email }
    var query2 = { id: {not: args.id,}}
    if(args.id != null) query1.push(query2)

    let row = await context.prisma.deliveryMan.findUnique({ where: query1 })
    if(row) throw new UserInputError("Cette adresse email est déjà attribuée à un livreur.", {cstm_code: 'E3192013'});

    if(args.id != null){
        let deliveryMan = await context.prisma.deliveryMan.findUnique({ where: query0 })
        if (!deliveryMan) throw new UserInputError("Ce livreur n'éxiste pas.", {cstm_code: 'E3192013'});
    }

    const date = new Date()
    const data= {civility:args.civility, firstname: args.firstname, lastname: args.lastname, phonenumber: args.phonenumber, email:args.email}

    let deliveryMan = args.id ? 
                await context.prisma.deliveryMan.update({data: {...data, updatedat: date}}) :
                await context.prisma.deliveryMan.create({data: data})
    return deliveryMan

}

export async function deleteDeliveryMan(parent, args, context, info){

  let entity = await context.prisma.deliveryMan.findUnique({ where: { id: args.id } })

  if(!entity) throw new UserInputError("Ce livreur n'éxiste pas.", {cstm_code: 'E3192013'});
    
  const deletedEntity = await context.prisma.deliveryMan.delete({where: {id: args.id,},})
  return deletedEntity
  
}

