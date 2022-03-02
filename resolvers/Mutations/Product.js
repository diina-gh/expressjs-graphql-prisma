import { UserInputError} from "apollo-server-express";

export async function saveProduct(parent, args, context, info) {
    
  if(args.name == null){
    throw new UserInputError("Veuillez donner une désignation.", {cstm_code: 'E3192013'});
  }

  else if(args.short_desc == null){
    throw new UserInputError("Veuillez donner une description.", {cstm_code: 'E3192013'});
  }

  else if(args.unit == null){
    throw new UserInputError("Veuillez donner l'unité du produit.", {cstm_code: 'E3192013'});
  }

  else if(args.unitweight == null){
    throw new UserInputError("Veuillez donner le poids par unité.", {cstm_code: 'E3192013'});
  }

  else if(args.unitprice == null){
    throw new UserInputError("Veuillez donner le prix par unité.", {cstm_code: 'E3192013'});
  }

  else if(args.categoryId == null){
    throw new UserInputError("Veuillez choisir une catégorie.", {cstm_code: 'E3192013'});
  }

  else if(args.images == null || args.images?.length <= 0){
    throw new UserInputError("Veuillez ajoutez des images.", {cstm_code: 'E3192013'});
  }
  
  else {

    for (let i = 0; i < args.images.length; i++) {
        if(args.images[i].url == null || args.images[i].url == '') throw new UserInputError("Veuillez donner l'url de l'image " + (i+1), {cstm_code: 'E3192013'});
        if(args.images[i].imageref == null || args.images[i].imageref == '') throw new UserInputError("Veuillez donner la référence de l'image " + (i+1), {cstm_code: 'E3192013'});
        // if(args.images[i].productId == null ) throw new UserInputError("Veuillez donner le produit correspondant à l'image " + (i+1), {cstm_code: 'E3192013'});
    }

    if(args.variants != null && args.variants.length >= 0){
        if(args.options == null || args.options.length <= 0) throw new UserInputError("Veuillez donner des options pour les variants de ce produit.", {cstm_code: 'E3192013'});
    }

    if(args.id != null){
      let product = await context.prisma.product.findUnique({ where: { id: args.id } })
      if (!product) throw new UserInputError("Ce produit n'éxiste pas.", {cstm_code: 'E3192013'});
    }

  }

  const date = new Date()
  
  let links = []
  let links2 = []
  
  const data= {name: args.name, short_desc: args.short_desc, long_desc: args.long_desc, status: args.status , activated: args.activated, unit: args.unit, unitweight: args.unitweight, unitprice: args.unitprice, taxable: args.taxable, order: args.order, images: {create: args.images}, category:{connect:{id: args.categoryId}} }

  if(args.variants != null && args.variants.length >= 0){

    for (let i = 0; i < args.variants.length; i++) {
      links.push({ assignedAt: date, variant: { connect: {id:args.variants[i]}}});
    }
    
    for (let i = 0; i < args.options.length; i++) {
      links2.push({ assignedAt: date, option: { connect: {id:args.options[i]}}});
    }

    data.variants = {create: links}
    data.options = {create: links2}

  }

  let product = args.id ? 
            await context.prisma.product.update({data: {...data, updatedat: date}}) :
            await context.prisma.product.create({data: data})
  return product
}

export async function deleteProduct(parent, args, context, info){

  let entity = await context.prisma.product.findUnique({ where: { id: args.id } })

  if(!entity){
    throw new UserInputError("Ce product n'éxiste pas.", {cstm_code: 'E3192013'});
  }
  else if(entity){
    let entity2 = await context.prisma.productsOnProducts.findMany({ where: { productId: args.id } })
    if(entity2 != null && entity2.length > 0) throw new UserInputError("Ce product est liée à des produits.", {cstm_code: 'E3192013'});
  }
    
  const deletedEntity = await context.prisma.product.delete({where: {id: args.id,},})
  return deletedEntity

}

