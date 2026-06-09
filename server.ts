import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "waitlist.json");

// Garante que o banco interno JSON existe e tem dados iniciais realistas
function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = [
      {
        id: 1,
        nome: "José Renato 'Zé' Dornelles",
        email: "ze.dornelles@ruralnet.com.br",
        created_at: "2026-06-07T14:30:00.000Z"
      },
      {
        id: 2,
        nome: "Mariana Alencar",
        email: "mariana.vida@agroforte.org",
        created_at: "2026-06-07T16:45:12.000Z"
      }
    ];
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
  }
}

initDb();

function getWaitlist() {
  try {
    const content = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(content);
  } catch (e) {
    return [];
  }
}

function saveWaitlist(data: any[]) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.use(express.json());

// API Endpoints correspondentes ao backend FastAPI para compatibilidade no preview local
app.get("/api/waitlist", (req, res) => {
  const data = getWaitlist();
  res.json(data);
});

app.post("/api/waitlist", (req, res) => {
  const { nome, email } = req.body;
  
  if (!nome || !email) {
    return res.status(400).json({ detail: "Nome e E-mail são campos obrigatórios." });
  }

  // Validação simples de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ detail: "Formato de e-mail inválido." });
  }

  const list = getWaitlist();
  const existing = list.find((item: any) => item.email.toLowerCase() === email.toLowerCase());
  
  if (existing) {
    return res.status(400).json({ detail: "Este e-mail já está cadastrado na lista de espera!" });
  }

  const newId = list.length > 0 ? Math.max(...list.map((item: any) => item.id)) + 1 : 1;
  const newItem = {
    id: newId,
    nome,
    email,
    created_at: new Date().toISOString()
  };

  list.push(newItem);
  saveWaitlist(list);

  res.status(201).json(newItem);
});

app.put("/api/waitlist/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, email } = req.body;

  const list = getWaitlist();
  const itemIndex = list.findIndex((item: any) => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ detail: "Registro não encontrado." });
  }

  if (nome) {
    list[itemIndex].nome = nome;
  }

  if (email) {
    // Verificar se outro cadastro está usando esse email
    const duplicate = list.find((item: any) => item.email.toLowerCase() === email.toLowerCase() && item.id !== id);
    if (duplicate) {
      return res.status(400).json({ detail: "Este e-mail já está em uso por outro cadastro." });
    }
    list[itemIndex].email = email;
  }

  saveWaitlist(list);
  res.json(list[itemIndex]);
});

app.delete("/api/waitlist/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const list = getWaitlist();
  const filtered = list.filter((item: any) => item.id !== id);

  if (filtered.length === list.length) {
    return res.status(404).json({ detail: "Registro não encontrado." });
  }

  saveWaitlist(filtered);
  res.status(204).send();
});

// Registrar o middleware Vite
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
