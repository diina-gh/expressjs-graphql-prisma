import { PrismaSelect } from '@paljs/plugins';

export async function saveCategory(parent, args, context, info) {
    
  if(args.name == null) return { __typename: "InputError", message: `Veuillez donner un nom.`,};
  if(args.desc == null) return { __typename: "InputError", message: `Veuillez donner une description`,};
  if(args.order == null) return { __typename:"InputError", message: `Veuillez donner un ordre`,};

  var query0 = { id: args.id }, query1 = { name: args.name.toLowerCase() }, query2 = {not: args.id,}

  if(args.id != null){
    let category = await context.prisma.category.findUnique({ where: query0 })
    if (!category) return { __typename: "InputError", message: `Cette catégorie n'éxiste pas`,};
    query1.id = query2;
  } 

  let row = await context.prisma.category.findFirst({ where: query1 })
  if(row) return { __typename: "InputError", message: `Cette catégorie éxiste déjà. Veuillez choisir un autre nom`,};

  if(args.parentId != null){
    let row2 = await context.prisma.category.findUnique({ where: {id: args.parentId} })
    if(!row2)  return { __typename: "InputError", message: `Cette catégorie parent n'éxiste pas`,};
  }

  const date = new Date()
  var data = {name: args.name.toLowerCase(),desc: args.desc, order:args.order, activated: args.activated}
  if(args.parentId != null) data.parentId = args.parentId

  let category = args.id ? 
    await context.prisma.category.update({where: {id:args.id}, data: {...data, updatedat: date}}) :
    await context.prisma.category.create({data: data})

    return { __typename: "Category", ...category,};

}

export async function deleteCategory(parent, args, context, info){

  if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

  let entity = await context.prisma.category.findUnique({ where: { id: args.id } })
  if(!entity) return { __typename: "InputError", message: `Cette catégorie n'éxiste pas`,};
  
  let product = await context.prisma.product.findFirst({where: { categoryId: args.id}})
  if(product) return { __typename: "InputError", message: `Cette catégorie est liée à des produits`,};

  let child = await context.prisma.category.findFirst({where: { parentId: args.id}})
  if(child) return { __typename: "InputError", message: `Cette catégorie est liée à d'autres catégories`,};

  const deletedEntity = await context.prisma.category.delete({where: {id: args.id,},})
  return { __typename: "Category", ...deletedEntity,};

}
