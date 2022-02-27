import bcrypt from "bcryptjs/index.js"
import jwt from "jsonwebtoken"
import { APP_SECRET, getUserId } from "../../utils.js"

export async function signup(parent, args, context, info) {
    // 1
    const password = await bcrypt.hash(args.password, 10)
  
    // 2
    const user = await context.prisma.user.create({ data: { ...args, password } })
  
    // 3
    const token = jwt.sign({ userId: user.id }, APP_SECRET)
  
    // 4
    return {
      token,
      user,
    }
  }
  
  export async function login(parent, args, context, info) {
    // 1
    const user = await context.prisma.user.findUnique({ where: { email: args.email } })
    if (!user) {
      throw new Error('No such user found')
    }
  
    // 2
    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
      throw new Error('Invalid password')
    }
  
    const token = jwt.sign({ userId: user.id }, APP_SECRET)
  
    // 3
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
