import { PrismaSelect } from '@paljs/plugins';

import { UserInputError} from "apollo-server-express";

export async function saveDiscount(parent, args, context, info) {
    
  if(args.name == null){
    throw new UserInputError("Veuillez donner une désignation.", {cstm_code: 'E3192013'});
  }
  else if(args.desc == null){
    throw new UserInputError("Veuillez donner une description.", {cstm_code: 'E3192013'});
  }
  else if(args.percent == null){
    throw new UserInputError("Veuillez donner le pourcentage de cette remise.", {cstm_code: 'E3192013'});
  }
  else if(args.products == null || args.products?.length <= 0){
    throw new UserInputError("Veuillez sélectionner des produits pour cette remise.", {cstm_code: 'E3192013'});
  }
  
  else {

    for (let i = 0; i < args.products.length; i++) {
        let row = await context.prisma.product.findUnique({ where: { id: args.products[i] } })
        if(!row) throw new UserInputError("Certaines des produits sélectionnées n'éxistent pas.", {cstm_code: 'E3192013'});
    }

    if(args.id == null){
      let discount = await context.prisma.discount.findUnique({ where: { name: args.name } })
      if (discount) throw new UserInputError("Cette remise éxiste déjà. Veuillez choisir un autre nom", {cstm_code: 'E3192013'});
    }

    else{
      let discount = await context.prisma.discount.findUnique({ where: { id: args.id } })
      if (!discount) throw new UserInputError("Cette remise n'éxiste pas.", {cstm_code: 'E3192013'});
    }
  }

  const date = new Date()

  let links = []

  for (let i = 0; i < args.products.length; i++) {
    links.push({ id: args.products[i]});
  }

  const data= {name: args.name, desc: args.desc, percent:args.percent, products: {connect: links}}

  let discount = args.id ? 
            await context.prisma.discount.update({data: {...data, updatedat: date}}) :
            await context.prisma.discount.create({data: data})
  return discount
}

export async function deleteDiscount(parent, args, context, info){

  let entity = await context.prisma.discount.findUnique({ where: { id: args.id } })

  if(!entity){
    throw new UserInputError("Cette remise n'éxiste pas.", {cstm_code: 'E3192013'});
  }
    
  const deletedEntity = await context.prisma.discount.delete({where: {id: args.id,},})
  return deletedEntity
  
}

