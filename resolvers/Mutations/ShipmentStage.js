import { PrismaSelect } from '@paljs/plugins';
import { UserInputError} from "apollo-server-express";

export async function saveShipmentStage(parent, args, context, info) {
    
    if(args.stage == null || args.stage == "") throw new UserInputError("Veuillez donner une désignation.", {cstm_code: 'E3192013'});
    if(args.desc == null || args.desc == "") throw new UserInputError("Veuillez donner une description.", {cstm_code: 'E3192013'});

    var query0 = { id: args.id }
    var query1 = { name: args.name }
    var query2 = { id: args.nextStageId }
    var query3 = { id: {not: args.id,}}

    if(args.id != null) query1.push(query3) && query2.push(query3)

    let row = await context.prisma.shipmentStage.findUnique({ where: query1 })
    if(row) throw new UserInputError("Ce nom est déjà attribué à un stage de livraison.", {cstm_code: 'E3192013'});

    if(args.nextStageId != null){
        let shipmentStage = await context.prisma.shipmentStage.findUnique({ where: query3 })
        if (!shipmentStage) throw new UserInputError("Ce stage de livraison n'éxiste pas.", {cstm_code: 'E3192013'});
    }

    if(args.id != null){
        let shipmentStage = await context.prisma.shipmentStage.findUnique({ where: query0 })
        if (!shipmentStage) throw new UserInputError("Ce stage de livraison n'éxiste pas.", {cstm_code: 'E3192013'});
    }

    const date = new Date()
    const data= {stage: args.stage, desc: args.desc, nextStageId: args.nextStageId}

    let shipmentStage = args.id ? 
            await context.prisma.shipmentStage.update({data: {...data, updatedat: date}}) :
            await context.prisma.shipmentStage.create({data: data})
            
    return shipmentStage

}

export async function deleteShipmentStage(parent, args, context, info){

  let entity = await context.prisma.shipmentStage.findUnique({ where: { id: args.id }})
  if(!entity) throw new UserInputError("Ce stage de livraison n'éxiste pas.", {cstm_code: 'E3192013'});
    
  const deletedEntity = await context.prisma.shipmentStage.delete({where: {id: args.id,},})
  return deletedEntity
  
}

