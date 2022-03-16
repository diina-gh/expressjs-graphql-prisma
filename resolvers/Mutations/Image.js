import { UserInputError} from "apollo-server-express";

export async function saveImage(parent, args, context, info) {
    
  if(args.url == null) throw new UserInputError("Veuillez donner l'url de l'image.", {cstm_code: 'E3192013'});
    
  if(args.imageref == null) throw new UserInputError("Veuillez donner l'imageref de l'image.", {cstm_code: 'E3192013'});

  if(args.id != null){
    let image = await context.prisma.image.findUnique({ where: {id: args.id} })
    if (!image) throw new UserInputError("Cette image n'éxiste pas.", {cstm_code: 'E3192013'});
  }
  
  const date = new Date()
  var data = {url: args.url, imageref: args.imageref, default: args.default}

  let image = args.id ? 
    await context.prisma.image.update({where: {id:args.id}, data: {...data, updatedat: date}}) :
    await context.prisma.image.create({data: data})
  
  return image
}

export async function deleteImage(parent, args, context, info){

  let entity = await context.prisma.image.findUnique({ where: { id: args.id } })
  if(!entity) throw new UserInputError("Cette image n'éxiste pas.", {cstm_code: 'E3192013'});

  const deletedEntity = await context.prisma.image.delete({where: {id: args.id,},})
  return deletedEntity

}

