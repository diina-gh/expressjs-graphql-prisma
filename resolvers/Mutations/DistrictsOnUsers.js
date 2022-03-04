import { UserInputError} from "apollo-server-express";

export async function saveDistrictsOnUsers(parent, args, context, info) {

    var defaultAddress = false;
    
    if(args.userId == null){
        throw new UserInputError("Utilisateur non défini.", {cstm_code: 'E3192013'});
    }
    else if(args.districtId == null){
        throw new UserInputError("Veuillez choisir un quartier.", {cstm_code: 'E3192013'});
    }
    else if(args.line1 == null){
        throw new UserInputError("Veuillez renseigner la ligne 1.", {cstm_code: 'E3192013'});
    }
    else if(args.default == true){
        defaultAddress = true;
    }

    var query0 = { id: args.id }
    var query1 = { id: args.userId }
    var query2 = { id: args.districtId }

    let row = await context.prisma.user.findUnique({ where: query1 })
    if(!row) throw new UserInputError("Cet utilisateur n'éxiste pas.", {cstm_code: 'E3192013'});

    let row2 = await context.prisma.district.findUnique({ where: query2 })
    if(!row2) throw new UserInputError("Ce quartier n'éxiste pas.", {cstm_code: 'E3192013'});

    if(args.id != null){
        let districtsOnUsers = await context.prisma.districtsOnUsers.findUnique({ where: query0 })
        if (!districtsOnUsers) throw new UserInputError("Cette adresse n'éxiste pas.", {cstm_code: 'E3192013'});
    }

    var count = await context.prisma.districtsOnUsers.count({where: {userId: args.userId, default: true},})
    if(count > 0 && defaultAddress == true ) await context.prisma.districtsOnUsers.updateMany({where: {default: true, userId: args.userId},data: {default: false},})

    var count2 = await context.prisma.districtsOnUsers.count({where: {userId: args.userId},})
    if (count2 == 0 && defaultAddress == false) defaultAddress = true

    const date = new Date()
    const data= {userId: args.userId, districtId: args.districtId, default: defaultAddress, line1: args.line1, line2: args.line2}

    let districtsOnUsers = args.id ? 
                await context.prisma.districtsOnUsers.update({data: {...data, updatedat: date}}) :
                await context.prisma.districtsOnUsers.create({data: data})
    return districtsOnUsers

}

export async function deleteDistrictsOnUsers(parent, args, context, info){

  let entity = await context.prisma.districtsOnUsers.findUnique({ where: { id: args.id } })

  if(!entity) throw new UserInputError("Cette adresse n'éxiste pas.", {cstm_code: 'E3192013'});
    
  const deletedEntity = await context.prisma.districtsOnUsers.delete({where: {id: args.id,},})
  return deletedEntity
  
}

