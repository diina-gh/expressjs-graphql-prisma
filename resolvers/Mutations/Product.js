export async function saveProduct(parent, args, context, info) {

  if(args.id != null){
    let product = await context.prisma.product.findUnique({ where: { id: args.id } })
    if (!product) return { __typename: "InputError", message: `Ce produit n'éxiste pas`,}; 
  }
    
  if(args.name == null) return { __typename: "InputError", message: `Veuillez donner une désignation`,};
  
  if(args.short_desc == null) return { __typename: "InputError", message: `Veuillez donner une description`,}; 
  
  if(args.unit == null) return { __typename: "InputError", message: `Veuillez donner l'unité du produit`,};
  
  if(args.unitweight == null) return { __typename: "InputError", message: `Veuillez donner le poids par unité`,};
  
  if(args.unitprice == null) return { __typename: "InputError", message: `Veuillez donner le prix par unité`,}; 
  
  if(args.categoryId == null) return { __typename: "InputError", message: `Veuillez choisir une catégorie`,};
  
  if(args.brandId == null) return { __typename: "InputError", message: `Veuillez choisir une marque`,};
  
  let category = await context.prisma.category.findUnique({ where: { id: args.id } })
  if(!category) return { __typename: "InputError", message: `Cette catégorie n'éxiste pas`,};

  let brand = await context.prisma.brand.findUnique({ where: { id: args.id } })
  if(!brand) return { __typename: "InputError", message: `Cette marque n'éxiste pas`,};

  if(args.variants != null && args.variants.length >= 0){
      if(args.options == null || args.options.length <= 0) return { __typename: "InputError", message: `Veuillez donner des options pour les variants de ce produit`,};
  }


  const date = new Date()

  let links = []
  let links2 = []
  
  const data= {name: args.name, short_desc: args.short_desc, long_desc: args.long_desc, status: args.status , activated: args.activated, unit: args.unit, unitweight: args.unitweight, unitprice: args.unitprice, taxable: args.taxable, order: args.order, images: {create: args.images}, category:{connect:{id: args.categoryId}}, brandId: args.brandId }

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

  return { __typename: "Product", ...product,};

}

export async function deleteProduct(parent, args, context, info){

  if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

  let entity = await context.prisma.product.findUnique({ where: { id: args.id } })
  if(!entity) return { __typename: "InputError", message: `Ce produit n'éxiste pas`,};
    
  const deletedEntity = await context.prisma.product.delete({where: {id: args.id,},})
  return { __typename: "Product", ...deletedEntity,};

}

