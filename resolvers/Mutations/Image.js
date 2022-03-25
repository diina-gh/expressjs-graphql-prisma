import { PrismaSelect } from '@paljs/plugins';

export async function saveImage(parent, args, context, info) {
    
  if(args.url == null) return { __typename: "InputError", message: `Veuillez donner l'url de l'image.`,};
    
  if(args.imageref == null) return { __typename: "InputError", message: `Veuillez donner l'imageref de l'image.`,};

  if(args.id != null){
    let image = await context.prisma.image.findUnique({ where: {id: args.id} })
    if (!image) return { __typename: "InputError", message: `Cette image n'éxiste pas.`,};
  }
  
  const date = new Date()
  var data = {url: args.url, imageref: args.imageref, default: args.default, productId: args.productId, optionId: args.optionId, brandId: args.brandId, categoryId: args.categoryId, userId:args.userId}

  let image = args.id ? 
    await context.prisma.image.update({where: {id:args.id}, data: {...data, updatedat: date}}) :
    await context.prisma.image.create({data: data})

    return { __typename: "Image", ...image};
}

export async function deleteImage(parent, args, context, info){

  let entity = await context.prisma.image.findUnique({ where: { id: args.id } })
  if(!entity) return { __typename: "InputError", message: `Cette image n'éxiste pas.`,};

  let deletedEntity = await context.prisma.image.delete({where: {id: args.id,},})
  return { __typename: "Image", ...deletedEntity};

}

