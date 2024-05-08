import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const usuarios = [{
  user: "santiago",
  email: "a@a.com",
  password: "$2a$05$AhpXQ1asl8wwcDRohvwTn.Iye1gx2LyBqnzuhnrzAuk3OVU0123Ri",
  role: "admin" 
}]


async function login(req, res) {
  const { user, password } = req.body;
  if (!user || !password) {
      return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
  }
  const usuarioAResvisar = usuarios.find(usuario => usuario.user === user);
  if (!usuarioAResvisar) {
      return res.status(400).send({ status: "Error", message: "Error durante login" });
  }
  const loginCorrecto = await bcryptjs.compare(password, usuarioAResvisar.password);
  if (!loginCorrecto) {
      return res.status(400).send({ status: "Error", message: "Error durante login" });
  }
  const token = jsonwebtoken.sign(
      { user: usuarioAResvisar.user },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
  );

  const cookieOption = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      path: "/"
  }
  res.cookie("jwt", token, cookieOption);
  const redirectPath = (usuarioAResvisar.role === "admin") ? "/admin" : "/user";
  res.send({ status: "ok", message: "Usuario loggeado", redirect: redirectPath });
}

async function register(req,res){
  const user = req.body.user;
  const password = req.body.password;
  const email = req.body.email;
  if(!user || !password || !email){
    return res.status(400).send({status:"Error",message:"Los campos están incompletos"})
  }
  const usuarioAResvisar = usuarios.find(usuario => usuario.user === user);
  if(usuarioAResvisar){
    return res.status(400).send({status:"Error",message:"Este usuario ya existe"})
  }
  const salt = await bcryptjs.genSalt(5);
  const hashPassword = await bcryptjs.hash(password,salt);
  const nuevoUsuario ={
    user, email, password: hashPassword, role: "user"
  }
  usuarios.push(nuevoUsuario);
  console.log(usuarios);
  return res.status(201).send({status:"ok",message:`Usuario ${nuevoUsuario.user} agregado`,redirect:"/"})
}

export const methods = {
  login,
  register
}