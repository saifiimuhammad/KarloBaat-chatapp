


import { User } from '../models/user.js';



// Creates new user, save it to database and in cookiee
const newUser = async (req, res) => {
  
  const avatar = {
    public_id: "djfjfdk",
    url: "djdjfjfjf"
  }

 const user =  await User.create({
    name: "Saif",
    username: "saif",
    password: "saif",
    avatar
  })

  res.status(201).json({
     message: "User created successfully"
  })
  console.log(user)
}

const login = (req, res) => {
  res.send("Login User")
}



export {
  login,
  newUser
}
