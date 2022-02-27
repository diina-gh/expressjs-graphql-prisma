import bcrypt from "bcryptjs/index.js"
import jwt from "jsonwebtoken"
import { APP_SECRET, getUserId } from "../../utils.js"
import { UserInputError} from "apollo-server-express";


export async function signup(parent, args, context, info) {
    
    if(args.firstname == null){
      throw new UserInputError("Veuillez renseigner le prénom de l'utilisateur.", {custom_code: 'E-3192013'});
    }
    else if(args.lastname == null){
      throw new UserInputError("Veuillez renseigner le nom de l'utilisateur.", {custom_code: 'E-3192013'});
    }
    else if (args.phonenumber == null){
      throw new UserInputError("Veuillez donner un numéro de téléphone.", {custom_code: 'E-3192013'});
    }
    else if (args.email == null){
      throw new UserInputError("Veuillez donner une adresse email.", {custom_code: 'E-3192013' });
    }
    else if (args.password == null){
      throw new UserInputError("Veuillez donner un mot de passe.", {custom_code: 'E-3192013'});
    }
    else if (args.repassword == null){
      throw new UserInputError("Veuillez confirmer le mot de passe.", {custom_code: 'E-3192013'});
    }

    const password = await bcrypt.hash(args.password, 10)
    let infos = {firstname: args.firstname, lastname: args.lastname, email: args.email, phonenumber:args.phonenumber, password: password}
    const user = await context.prisma.user.create({ data: infos })
    const token = jwt.sign({ userId: user.id }, APP_SECRET)
    return {token,user}
 
  }
  
  export async function login(parent, args, context, info) {
    
    const user = await context.prisma.user.findUnique({ where: { email: args.email } })
    if (!user) {
      return('No such user found')
    }
  
    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
      return('Invalid password')
    }
  
    const token = jwt.sign({ userId: user.id }, APP_SECRET)
  
    return {
      token,
      user,
    }
  }


//   export async function post(parent, args, context, info) {
//     const { userId } = context;
  
//     return await context.prisma.link.create({
//       data: {
//         url: args.url,
//         description: args.description,
//         postedBy: { connect: { id: userId } },
//       }
//     })
//   }
