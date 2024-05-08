import express from "express";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { login, register } from './controllers/authentication.controller.js';
import { soloAdmin, soloPublico, soloUser } from './middlewares/authorization.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

// Rutas públicas
router.get("/", soloPublico, (req, res) => res.sendFile(join(__dirname, "pages/login.html")));
router.get("/register", soloPublico, (req, res) => res.sendFile(join(__dirname, "pages/register.html")));

// Rutas protegidas por roles
router.get("/admin", soloAdmin, (req, res) => res.sendFile(join(__dirname, "pages/admin/admin.html")));
router.get("/user", soloUser, (req, res) => res.sendFile(join(__dirname, "pages/user.html")));

// Rutas de API
router.post("/api/login", login);
router.post("/api/register", register);

export default router;
