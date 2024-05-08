import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import {usuarios} from "./../controllers/authentication.controller.js";

dotenv.config();

function revisarCookie(req) {
  try {
      const cookieJWT = req.cookies.jwt;
      if (!cookieJWT) return false;

      const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
      const usuarioAResvisar = usuarios.find(usuario => usuario.user === decodificada.user);
      return usuarioAResvisar; // Devuelve el usuario decodificado
  } catch (error) {
      return false;
  }
}

export const methods = {
  soloAdmin: (req, res, next) => {
      const usuario = revisarCookie(req);
      if (!usuario || usuario.role !== "admin") {
          return res.redirect("/");
      }
      next();
  },
  soloPublico: (req, res, next) => {
      const usuario = revisarCookie(req);
      if (usuario) {
          if (usuario.role === "admin") {
              return res.redirect("/admin");
          } else if (usuario.role === "user") {
              return res.redirect("/user");
          }
      }
      next();
  },
  soloUser: (req, res, next) => {
      const usuario = revisarCookie(req);
      if (!usuario || usuario.role !== "user") {
          return res.redirect("/");
      }
      next();
  }
};