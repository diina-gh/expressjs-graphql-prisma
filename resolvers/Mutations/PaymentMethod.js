import { PrismaSelect } from '@paljs/plugins';

export async function savePaymentMethod(parent, args, context, info) {
    
    if(args.name == null ) return { __typename: "InputError", message: `Veuillez donner une désignation`,};
    if(args.code == null ) return { __typename: "InputError", message: `Veuillez donner un code`,};
    if(args.desc == null ) return { __typename: "InputError", message: `Veuillez donner une description`,};

    var query0 = { id: args.id }, query1 = { code: args.code }, query2 = {not: args.id,}

    if(args.id != null){
      let paymentMethod = await context.prisma.paymentMethod.findUnique({ where: query0 })
      if (!paymentMethod) return { __typename: "InputError", message: `Ce mode de livraison n'éxiste pas`,};
      query1.id = query2
    } 

    let row = await context.prisma.paymentMethod.findFirst({ where: query1 })
    if(row) return { __typename: "InputError", message: `Ce code est déjà attribué à un mode de livraison`,};

    const date = new Date()
    const data= {name: args.name, code: args.code, desc: args.desc}

    let paymentMethod = args.id ? 
            await context.prisma.paymentMethod.update({where: {id:args.id}, data: {...data, updatedat: date}}) :
            await context.prisma.paymentMethod.create({data: data})

    return { __typename: "PaymentMethod", ...paymentMethod,};
}

export async function deletePaymentMethod(parent, args, context, info){

  if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

  let entity = await context.prisma.paymentMethod.findUnique({ where: { id: args.id } })
  if(!entity) return { __typename: "InputError", message: `Ce mode de livraison n'éxiste pas`,};
    
  const deletedEntity = await context.prisma.paymentMethod.delete({where: {id: args.id,},})
  return { __typename: "PaymentMethod", ...deletedEntity,};
  
}

