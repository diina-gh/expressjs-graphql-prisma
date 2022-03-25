import bcrypt from "bcryptjs/index.js"
import jwt from "jsonwebtoken"
import { APP_SECRET, getUserId } from "../../utils.js"
import { UserInputError} from "apollo-server-express";
import { PrismaSelect } from '@paljs/plugins';

export async function signup(parent, args, context, info) {
    
    if(args.firstname == null){
      throw new UserInputError("Veuillez renseigner le prénom de l'utilisateur.", {cstm_code: 'E3192013'});
    }
    else if(args.lastname == null){
      throw new UserInputError("Veuillez renseigner le nom de l'utilisateur.", {cstm_code: 'E3192013'});
    }
    else if (args.phonenumber == null){
      throw new UserInputError("Veuillez donner un numéro de téléphone.", {cstm_code: 'E3192013'});
    }
    else if (args.email == null){
      throw new UserInputError("Veuillez donner une adresse email.", {custom_code: 'E3192013' });
    }
    else if (args.email != null){
      let user = await context.prisma.user.findUnique({ where: { email: args.email } })
      if (user) throw new UserInputError("Cette adresse email éxiste déjà.", {cstm_code: 'E3192013'});
    }
    else if (args.password == null){
      throw new UserInputError("Veuillez donner un mot de passe.", {cstm_code: 'E3192013'});
    }
    else if (args.repassword == null){
      throw new UserInputError("Veuillez confirmer le mot de passe.", {cstm_code: 'E3192013'});
    }
    else if (args.repassword != args.password){
      throw new UserInputError("Les deux mots de passe ne correspondent pas.", {cstm_code: 'E3192013'});
    }

    const password = await bcrypt.hash(args.password, 10)
    let infos = {firstname: args.firstname, lastname: args.lastname, email: args.email, phonenumber:args.phonenumber, password: password}
    const user = await context.prisma.user.create({ data: infos })
    const token = jwt.sign({ userId: user.id }, APP_SECRET)
    return {token,user}
 
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

