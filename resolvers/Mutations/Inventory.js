import { UserInputError} from "apollo-server-express";

export async function saveInventory(parent, args, context, info) {
    
  if(args.quantity == null){
    throw new UserInputError("Veuillez donner une quantité.", {cstm_code: 'E3192013'});
  }
  else if(args.productId == null){
    throw new UserInputError("Veuillez sélectionner un produit.", {cstm_code: 'E3192013'});
  }
  
  else {

    let row = await context.prisma.product.findUnique({ where: { id: args.productId } })
    if(!row) throw new UserInputError("Ce produit n'éxiste pas.", {cstm_code: 'E3192013'});

    let row2 = await context.prisma.inventory.findUnique({ where: { productId: args.productId } })
    if(row2) throw new UserInputError("Ce produit éxiste déjà en stock. Pour changer sa quantité, veuillez modifier la ligne correspondante.", {cstm_code: 'E3192013'});

    if(args.id != null){
      let inventory = await context.prisma.inventory.findUnique({ where: { id: args.id } })
      if (!inventory) throw new UserInputError("Ce stock n'éxiste pas.", {cstm_code: 'E3192013'});
    }
  }

  const date = new Date()
  const data= {quantity: args.quantity, details: args.details, productId: args.productId}

  let inventory = args.id ? 
            await context.prisma.inventory.update({data: {...data, updatedat: date}}) :
            await context.prisma.inventory.create({data: data})
  return inventory
}

export async function deleteInventory(parent, args, context, info){

  let entity = await context.prisma.inventory.findUnique({ where: { id: args.id } })
  if(!entity) throw new UserInputError("Ce stock n'éxiste pas.", {cstm_code: 'E3192013'});
  if(entity.productId != null) throw new UserInputError("Ce stock est liée à un produit.", {cstm_code: 'E3192013'});
    
  const deletedEntity = await context.prisma.inventory.delete({where: {id: args.id,},})
  return deletedEntity
  
}

