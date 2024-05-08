// authentication.controller.test.js

import { login, register, usuarios } from "./authentication.controller.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

// Mocks
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("dotenv");

describe("Authentication Controller", () => {
  describe("login", () => {
    it("debería devolver un estado 400 si falta un campo requerido", async () => {
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        status: "Error",
        message: "Los campos están incompletos"
      });
    });

    it("debería devolver un estado 400 si el usuario no existe", async () => {
      const req = { body: { user: "usuario", password: "contraseña" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        status: "Error",
        message: "Error durante login"
      });
    });

    it("debería devolver un estado 400 si la contraseña es incorrecta", async () => {
      const req = { body: { user: "santiago", password: "contraseña" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const usuarioAResvisar = usuarios.find(usuario => usuario.user === req.body.user);
      bcryptjs.compare.mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        status: "Error",
        message: "Error durante login"
      });
    });

    it("debería devolver un estado 200 y un token JWT si el inicio de sesión es correcto", async () => {
      const req = { body: { user: "santiago", password: "contraseña" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), cookie: jest.fn() };
      const usuarioAResvisar = usuarios.find(usuario => usuario.user === req.body.user);
      bcryptjs.compare.mockResolvedValue(true);
      jsonwebtoken.sign.mockReturnValue("jwtToken");

      await login(req, res);

      expect(res.cookie).toHaveBeenCalledWith("jwt", "jwtToken", expect.any(Object));
      expect(res.send).toHaveBeenCalledWith({
        status: "ok",
        message: "Usuario loggeado",
        redirect: "/admin"
      });
    });
  });

  describe("register", () => {
    it("debería devolver un estado 400 si falta un campo requerido", async () => {
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        status: "Error",
        message: "Los campos están incompletos"
      });
    });

    it("debería devolver un estado 400 si el usuario ya existe", async () => {
      const req = { body: { user: "santiago", password: "contraseña", email: "correo@ejemplo.com" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        status: "Error",
        message: "Este usuario ya existe"
      });
    });

    it("debería devolver un estado 201 y un mensaje de éxito si el registro es exitoso", async () => {
      const req = { body: { user: "nuevoUsuario", password: "contraseña", email: "correo@ejemplo.com" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        status: "ok",
        message: "Usuario nuevoUsuario agregado",
        redirect: "/"
      });
    });
  });
});
