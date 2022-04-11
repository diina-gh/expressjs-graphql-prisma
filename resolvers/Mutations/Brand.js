import { PrismaSelect } from '@paljs/plugins';

export async function saveBrand(parent, args, context, info) {
    
  if(args.name == null || args.name == '') return { __typename: "InputError", message: `Veuillez donner un nom.`,};
  // if(args.desc == null || args.desc == '') return { __typename: "InputError", message: `Veuillez donner une description`,};
  if(args.order == null || args.order == 0) return { __typename:"InputError", message: `Veuillez donner un ordre`,};

  if(args.id != null){
    let brand = await context.prisma.brand.findUnique({ where: {id: args.id} })
    if (!brand) return { __typename: "InputError", message: `Cette marque n'éxiste pas.`,};
  }
  
  const date = new Date()
  var data = {name: args.name,desc: args.desc, order:args.order, order:args.order }

  let brand = args.id ? 

    await context.prisma.brand.update({where: {id:args.id},data: {...data, updatedat: date}}) :
    await context.prisma.brand.create({data: data})
  
  return { __typename: "Brand", ...brand,};
}

export async function deleteBrand(parent, args, context, info){

  if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};

  let entity = await context.prisma.brand.findUnique({ where: { id: args.id } })
  if(!entity) return { __typename: "InputError", message: `Cette marque n'éxiste pas.`,};
 
  const deletedEntity = await context.prisma.brand.delete({where: {id: args.id,},})
  return { __typename: "Brand", ...deletedEntity,};

}

