import { UserInputError} from "apollo-server-express";

export async function saveCartItem(parent, args, context, info) {
   
  const { userId } = context;
  var cart = null

  if(args.unitprice == null){
    throw new UserInputError("Veuillez donner le prix par unité.", {cstm_code: 'E3192013'});
  }
  else if(args.discount == null){
    throw new UserInputError("Veuillez donner la remise en pourcentage.", {cstm_code: 'E3192013'});
  }
  else if(args.quantity == null || args.quantity < 0 || (args.id == null && args.quantity == 0)){
    throw new UserInputError("Veuillez donner une quantité valide.", {cstm_code: 'E3192013'});
  }
  else if(args.productId == null){
    throw new UserInputError("Veuillez préciser le produit.", {cstm_code: 'E3192013'});
  }
  
  else {

    let row = await context.prisma.product.findUnique({ where: { id: args.productId } })
    if(!row) throw new UserInputError("Ce produit n'éxiste pas.", {cstm_code: 'E3192013'});

    if(args.optionId != null){

        let row2 = await context.prisma.option.findUnique({ where: { id: args.optionId } })
        if(!row2) throw new UserInputError("Cette option n'éxiste pas.", {cstm_code: 'E3192013'});

        let rows = await context.prisma.optionsOnProducts.findMany({ where: { optionId: args.optionId, productId:args.productId } })
        if(!rows || rows.length == 0) throw new UserInputError("Cette option n'est pas liée à ce produit.", {cstm_code: 'E3192013'});

        let rows2 = await context.prisma.cartItem.findMany({ where: { optionId: args.optionId, productId:args.productId } })
        if(rows2 && rows2.length > 0 && args.id == null) throw new UserInputError("Veuillez donner l'id de l'article que vous voulez modifier.", {cstm_code: 'E3192013'});

    }

    cart = await context.prisma.cart.findUnique({ where: { userId: userId } })

    if(!cart){
        if(args.quantity <= 0) throw new UserInputError("Veuillez donner une quantité valide.", {cstm_code: 'E3192013'});
        cart = await context.prisma.cart.create({data: {status: 1, userId:userId,},})
    } 
    
    if(args.id != null){
      let CartItem = await context.prisma.cartItem.findUnique({ where: { id: args.id } })
      if (!CartItem) throw new UserInputError("Cet article n'éxiste pas dans le panier.", {cstm_code: 'E3192013'});
    }
  }

  if(args.quantity != 0){
    const date = new Date()
    const data= {quantity: args.quantity, optionId: args.optionId, productId: args.productId, cartId: cart.id, unitprice:args.unitprice, discount: args.discount}
  
    let cartItem = args.id ? 
              await context.prisma.cartItem.update({data: {...data, updatedat: date}}) :
              await context.prisma.cartItem.create({data: data})
    return cartItem
  }
  else{
    let entity = await context.prisma.cartItem.findUnique({ where: { id: args.id } })
    if(!entity) throw new UserInputError("Cet article n'éxiste pas dans le panier.", {cstm_code: 'E3192013'});
    await context.prisma.cartItem.delete({where: {id: args.id,},})
    let cartItem = await context.prisma.cartItem.findMany({ where: { id: args.id } })
    return cartItem
  }

}

export async function deleteCartItem(parent, args, context, info){

  let entity = await context.prisma.cartItem.findUnique({ where: { id: args.id } })
  if(!entity) throw new UserInputError("Cet article n'éxiste pas dans le panier.", {cstm_code: 'E3192013'});

  const deletedEntity = await context.prisma.cartItem.delete({where: {id: args.id,},})
  return deletedEntity
  
}

