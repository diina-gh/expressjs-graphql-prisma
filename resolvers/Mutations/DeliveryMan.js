import { UserInputError} from "apollo-server-express";

export async function saveDeliveryMan(parent, args, context, info) {
    
    if(args.civility == null) return { __typename: "InputError", message: `Veuillez donner une civilité`,}; 
    if(args.civility != "MONSIEUR" && args.civility != "MADAME") return { __typename: "InputError", message: `Veuillez donner une civilité valide`,};
    if(args.firstname == null) return { __typename: "InputError", message: `Veuillez donner un prénom`,};
    if(args.lastname == null) return { __typename: "InputError", message: `Veuillez donner un nom`,};
    if (args.phonenumber == null) return { __typename: "InputError", message: `Veuillez donner un numéro de téléphone`,};
    if (args.email == null) return { __typename: "InputError", message: `Veuillez donner une adresse email`,};
    
    var query0 = { id: args.id }, query1 = { email: args.email }, query2 = {not: args.id,}

    if(args.id != null){
      let deliveryMan = await context.prisma.deliveryMan.findUnique({ where: query0 })
      if (!deliveryMan) return { __typename: "InputError", message: `Ce livreur n'éxiste pas`,};
      query1.id = query2
    } 

    let row = await context.prisma.deliveryMan.findFirst({ where: query1 })
    if(row) return { __typename: "InputError", message: `Cette adresse email est déjà attribuée à un livreur`,};

    const date = new Date()
    const data= {civility:args.civility, firstname: args.firstname, lastname: args.lastname, phonenumber: args.phonenumber, email:args.email}

    let deliveryMan = args.id ? 
                await context.prisma.deliveryMan.update({where: {id:args.id}, data: {...data, updatedat: date}}) :
                await context.prisma.deliveryMan.create({data: data})

    return { __typename: "DeliveryMan", ...deliveryMan,};

}

export async function deleteDeliveryMan(parent, args, context, info){

  if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

  let entity = await context.prisma.deliveryMan.findUnique({ where: { id: args.id } })
  if(!entity) return { __typename: "InputError", message: `Ce livreur n'éxiste pas`,};
    
  const deletedEntity = await context.prisma.deliveryMan.delete({where: {id: args.id,},})
  return { __typename: "DeliveryMan", ...deletedEntity,};
  
}

