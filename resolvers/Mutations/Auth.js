import bcrypt from "bcryptjs/index.js"
import jwt from "jsonwebtoken"
import { APP_SECRET, getDifference, getUserId } from "../../utils.js"
import { UserInputError} from "apollo-server-express";

export async function saveUser(parent, args, context, info) {

    var query0 = { id: args.id }; var query1 = { email: args.email };  var query2 = {not: args.id,};

    if(args.id != null){
      let user = context.prisma.user.findUnique({where:query0, select:{id:true}})
      if(!user) return { __typename: "InputError", message: `Erreur, utilisateur introuvable`,};
      query1.id = query2
    }
    
    if(args.civility != "MONSIEUR" && args.civility != "MADAME") return { __typename: "InputError", message: `Veuillez donner une civilité valide`,};
    if(args.firstname == null || args.firstname == '') return { __typename: "InputError", message: `Veuillez renseigner le prénom de l'utilisateur`,};
    if(args.lastname == null || args.lastname == '') return { __typename: "InputError", message: `Veuillez renseigner le nom de l'utilisateur`,};
    if (args.phonenumber == null || args.phonenumber == '') return { __typename: "InputError", message: `Veuillez donner un numéro de téléphone`,};
    if (args.email == null || args.email == '') return { __typename: "InputError", message: `Veuillez donner une adresse email`,};

    if(args.id == null || (args.id != null && (args.password?.length > 1 || args.repassword?.length > 1))){
      if (args.password == null || args.password == '') return { __typename: "InputError", message: `Veuillez donner un mot de passe`,};
      if (args.repassword == null) return { __typename: "InputError", message: `Veuillez confirmer le mot de passe`,};
      if (args.repassword != args.password) return { __typename: "InputError", message: `Les deux mots de passe ne correspondent pas`,};
    }

    if(args.roles == null || args.roles?.length <= 0) return { __typename: "InputError", message: `Veuillez sélectionner au moins un role pour cet utilisateur`,};

    let row = await context.prisma.user.findFirst({ where: query1, select:{id:true} })
    if (row) return { __typename: "InputError", message: `Cette adresse email éxiste déjà`,};

    for (let i = 0; i < args.roles.length; i++) {
      let row = await context.prisma.role.findUnique({ where: { id: args.roles[i] }, select:{id: true} })
      if(!row) return { __typename: "InputError", message: `Certains des roles sélectionnés n'éxistent pas au niveau de la base de données`,};
    }

    const date = new Date()
    var data = {civility: args.civility, firstname: args.firstname, lastname: args.lastname, email: args.email, phonenumber:args.phonenumber, roles: {}}

    if(args.id == null || (args.id != null && (args.password?.length > 1 || args.repassword?.length > 1))){
      const password = await bcrypt.hash(args.password, 10)
      data.password = password
    }

    var links = []

    if(args.id != null){
      var savedRoles = await context.prisma.RolesOnUsers.findMany({where: {userId: args.id}})
      savedRoles = savedRoles.map((item) => item.id)
      var diffs = getDifference(savedRoles, args.roles)
      var plus =  getDifference(args.roles, savedRoles)
      if(diffs.length > 0) for (let i = 0; i < diffs.length; i++) await context.prisma.RolesOnUsers.delete({where: {roleId: diffs[i],},})
      if(plus.length > 0) for (let i = 0; i < plus.length; i++) links.push({ assignedAt: date, assignedById: 0, role: { connect: {id:plus[i]}}});
    }
    else{
      for (let i = 0; i < args.roles.length; i++) links.push({ assignedAt: date, assignedById: 0, role: { connect: {id:args.roles[i]}}});
    }

    data.roles.create = links

    var user = args.id ? 
        await context.prisma.user.update({where: {id:args.id}, data: {...data, updatedat: date}}) :
        await context.prisma.user.create({data: data})
    
    const token = jwt.sign({ userId: user.id }, APP_SECRET)
    const authPayload = {token,user}

    return { __typename: "AuthPayload", ...authPayload,};

  }

  export async function saveClient(parent, args, context, info) {

    var query0 = { id: args.id }; var query1 = { email: args.email };  var query2 = {not: args.id,};

    if(args.id != null){
      let user = context.prisma.user.findUnique({where:query0, select:{id:true}})
      if(!user) return { __typename: "InputError", message: `Erreur, utilisateur introuvable`,};
      query1.id = query2
    }
    
    if(args.civility != "MONSIEUR" && args.civility != "MADAME") return { __typename: "InputError", message: `Veuillez donner une civilité valide`,};
    if(args.firstname == null || args.firstname == '') return { __typename: "InputError", message: `Veuillez renseigner le prénom de l'utilisateur`,};
    if(args.lastname == null || args.lastname == '') return { __typename: "InputError", message: `Veuillez renseigner le nom de l'utilisateur`,};
    if (args.phonenumber == null || args.phonenumber == '') return { __typename: "InputError", message: `Veuillez donner un numéro de téléphone`,};
    if (args.email == null || args.email == '') return { __typename: "InputError", message: `Veuillez donner une adresse email`,};

    if(args.addresses == null || args.addresses?.length == 0) return { __typename: "InputError", message: `Veuillez ajouter au moins une adresse`,};

    let row = await context.prisma.user.findFirst({ where: query1, select:{id:true} })
    if (row) throw new UserInputError("Cette adresse email éxiste déjà.", {cstm_code: 'E3192013'});

    for (let i = 0; i < args.addresses.length; i++) {
      let row = await context.prisma.district.findUnique({ where: { id: args.addresses[i].districtId }, select:{id: true} })
      if(!row) return { __typename: "InputError", message: `Certaines des zones choisies n'éxistent pas au niveau de la base de données`,};
    }

    const date = new Date()
    var data = {civility: args.civility,firstname: args.firstname, lastname: args.lastname, email: args.email, phonenumber:args.phonenumber, customer: true, districts: {create: args.addresses}}

    if(args.id != null) await context.prisma.DistrictsOnUsers.deleteMany({where: {userId: args.id}})
      
    let user = args.id ? 
        await context.prisma.user.update({where: {id:args.id}, data: {...data, updatedat: date}}) :
        await context.prisma.user.create({data: data})

    return { __typename: "User", ...user,};

  }

  export async function deleteUser(parent, args, context, info){

    if(args.id == null) return { __typename: "InputError", message: `Veuilez donner un identifiant`,};
  
    let entity = await context.prisma.user.findUnique({ where: { id: args.id } })
    if(!entity) return { __typename: "InputError", message: `Cet utilisateur n'éxiste pas`,};
  
    const deletedEntity = await context.prisma.user.delete({where: {id: args.id,},})
    return { __typename: "User", ...deletedEntity,};
    
  }
  
  export async function login(parent, args, context, info) {

    if(args.email == null){
      throw new UserInputError("Veuillez donner votre adresse email.", {cstm_code: 'E3192013'});
    }
    else if(args.password == null){
      throw new UserInputError("Veuillez donner votre mot de passe.", {cstm_code: 'E3192013'});
    }
    
    const user = await context.prisma.user.findUnique({ where: { email: args.email } })
    if (!user) throw new UserInputError("Cet utilisateur n'éxiste pas.", {cstm_code: 'E3192013'});
    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) throw new UserInputError("Mot de passe incorrecte.", {cstm_code: 'E3192013'});

    const token = jwt.sign({ userId: user.id }, APP_SECRET)
    return {token,user,}
   
  }

