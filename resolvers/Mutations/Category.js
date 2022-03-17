import { UserInputError} from "apollo-server-express";

export async function saveCategory(parent, args, context, info) {
    
  if(args.name == null) return { __typename: "InputError", message: `Veuillez donner un nom.`,};


  if(args.desc == null) throw new UserInputError("Veuillez donner une description.", {cstm_code: 'E3192013'});
  
  if(args.order == null) throw new UserInputError("Veuillez donner un ordre.", {cstm_code: 'E3192013'});

  var query0 = { id: args.id }
  var query1 = { name: args.name }
  var query2 = { id: {not: args.id,}}
  if(args.id != null) query1.push(query2);

  let row = await context.prisma.category.findUnique({ where: query1 })
  if(row) throw new UserInputError("Cette catégorie éxiste déjà. Veuillez choisir un autre nom.", {cstm_code: 'E3192013'});

  if(args.parentId != null){
    let row2 = await context.prisma.category.findUnique({ where: {id: args.parentId} })
    if(!row2) throw new UserInputError("Cette catégorie parent n'éxiste pas.", {cstm_code: 'E3192013'});
  }

  if(args.id != null){
    let category = await context.prisma.category.findUnique({ where: query0 })
    if (!category) throw new UserInputError("Cette catégorie n'éxiste pas.", {cstm_code: 'E3192013'});
  }
  
  const date = new Date()
  var data = {name: args.name,desc: args.desc, long_desc:args.long_desc, order:args.order }
  if(args.parentId != null) data.parentId = args.parentId

  let category = args.id ? 
    await context.prisma.category.update({where: {id:args.id},data: {...data, updatedat: date}}) :
    await context.prisma.category.create({data: data})
  
  return category
}

export async function deleteCategory(parent, args, context, info){

  let entity = await context.prisma.category.findUnique({ where: { id: args.id } })
  if(!entity) throw new UserInputError("Cette catégorie n'éxiste pas.", {cstm_code: 'E3192013'});
  
  let product = await context.prisma.product.findFirst({where: { categoryId: args.id}})
  if(product) throw new UserInputError("Cette catégorie est liée à des produits.", {cstm_code: 'E3192013'});

  const deletedEntity = await context.prisma.category.delete({where: {id: args.id,},})
  return deletedEntity

}

