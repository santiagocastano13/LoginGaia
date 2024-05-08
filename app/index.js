import express from "express";
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.set("port", 3000);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());

app.use('/', routes);

app.listen(app.get("port"), () => {
  console.log("Servidor corriendo en puerto", app.get("port"));
});
