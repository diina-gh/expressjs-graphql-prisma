import { PrismaSelect } from '@paljs/plugins';
import { UserInputError} from "apollo-server-express";

export async function saveOrder(parent, args, context, info) {

    if(args.userId == null) throw new UserInputError("Utilisateur non défini.", {cstm_code: 'E3192013'});
    if(args.cartItems == null  || args.cartItems.length == 0) throw new UserInputError("Veuillez sélectionner les produits que vous voulez commander.", {cstm_code: 'E3192013'});
    if(args.districtsOnUsersId == null) throw new UserInputError("Veuillez donner une adresse.", {cstm_code: 'E3192013'});
    if(args.shippingMethodId == null) throw new UserInputError("Veuillez choisir un mode de livraison.", {cstm_code: 'E3192013'});

    var shippingMethod = await context.prisma.shippingMethod.findUnique({ where: { id: args.shippingMethodId },})
    if(!shippingMethod) throw new UserInputError("Ce mode de livraison n'éxiste pas.", {cstm_code: 'E3192013'});

    var user = await context.prisma.user.findUnique({ where: { id: args.userId },})
    if(!user) throw new UserInputError("Cet utilisateur n'éxiste pas.", {cstm_code: 'E3192013'});

    var address = await context.prisma.districtsOnUsers.findUnique({ where: { id: args.districtsOnUsersId }, include: {district: true}})
    if(!address) throw new UserInputError("Cette adresse n'éxiste pas.", {cstm_code: 'E3192013'});

    var subtotal = 0

    for (let i = 0; i < args.cartItems.length; i++) {
        //Checking inputs
        if(args.cartItems[i].productId == null) throw new UserInputError("Veuillez donner l'id du produit à la ligne " + (i+1), {cstm_code: 'E3192013'});
        if(args.cartItems[i].quantity == null)  throw new UserInputError("Veuillez donner la quantité à la ligne " + (i+1), {cstm_code: 'E3192013'});
        if(args.cartItems[i].unitprice == null) throw new UserInputError("Veuillez donner le prix à la ligne " + (i+1), {cstm_code: 'E3192013'});
        
        let discount = args.cartItems[i].discount ? args.cartItems[i].discount : 0 

        //Checking product
        let row = await context.prisma.product.findUnique({ where: { id: args.cartItems[i].productId } })
        if(!row) throw new UserInputError("Le produit " + (i+1) + " n'éxiste pas.", {cstm_code: 'E3192013'});
        //Checking option
        if(args.cartItems[i].optionId != null){
            let row2 = await context.prisma.option.findUnique({ where: { id: args.cartItems[i].optionId } })
            if(!row2) throw new UserInputError("L'option " + (i+1) + " n'éxiste pas.", {cstm_code: 'E3192013'});
        }
        //Checking the link between the product and the option
        let count = await context.prisma.optionsOnProducts.count({ where: { optionId: args.cartItems[i].optionId, productId:args.cartItems[i].productId } })
        if(count <= 0) throw new UserInputError("L'option " + (i+1) + " n'est pas liée au produit " + (i+1) + "", {cstm_code: 'E3192013'});

        subtotal += (args.cartItems[i].unitprice - (args.cartItems[i].unitprice * discount))
    }

    if(args.id != null){
        let order = await context.prisma.order.findUnique({ where: { id: args.id } })
        if (!order) throw new UserInputError("Cette commande n'éxiste pas.", {cstm_code: 'E3192013'});
    }

    const shipping = shippingMethod.code == 'livraison' ? address.district.shipping : 0
    const total = subtotal + shipping
    const date = new Date()
    const data = {firstname: user.firtname, lastname: user.lastname, email: user.email, phonenumber: user.phonenumber,
                 userId: user.id, line1: address.line1, line2: address.line2, districtId: address.districtId, status: 0,
                 subtotal: subtotal, shipping: address.district.shipping, total: total}

    let order = args.id ? 
            await context.prisma.order.update({data: {...data, updatedat: date}}) :
            await context.prisma.order.create({data: data})

    for (let i = 0; i < args.cartItems.length; i++) {
        var data2 = {orderId: order.id, productId: args.cartItems[i].productId, optionId: args.cartItems[i].optionId, 
                    quantity: args.cartItems[i].quantity, unitprice: args.cartItems[i].unitprice, discount: args.cartItems[i].discount }
        let id = args.cartItems[i].id ? args.cartItems[i].id : 0
        await context.prisma.orderItem.upsert({ where: {id: id,}, update: {...data2, updatedat: date}, create: data2 }) 
    }

    return order
}


// export async function deleteOrder(parent, args, context, info){

//   let entity = await context.prisma.inventory.findUnique({ where: { id: args.id } })
//   if(!entity) throw new UserInputError("Ce stock n'éxiste pas.", {cstm_code: 'E3192013'});
//   if(entity.productId != null) throw new UserInputError("Ce stock est liée à un produit.", {cstm_code: 'E3192013'});
    
//   const deletedEntity = await context.prisma.inventory.delete({where: {id: args.id,},})
//   return deletedEntity
  
// }

