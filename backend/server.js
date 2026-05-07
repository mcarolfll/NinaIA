require("dotenv").config();

if (!process.env.GROQ_API_KEY) {
  console.warn("⚠️ GROQ_API_KEY não configurada. O chat não funcionará.");
}

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const conexao = require("./db");

const app = express();

app.use(cors({
  origin: "https://nina-ia.vercel.app"
}));

app.use(express.json());

// TESTE
app.get("/", (req, res) => {
  res.send("API da Nina funcionando!");
});

// LOGIN (cadastro)
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha obrigatórios" });
  }

  const sql = "INSERT INTO login (email, senha) VALUES (?, ?)";

  conexao.query(sql, [email, senha], (erro, resultado) => {
    if (erro) {
      console.error("Erro MySQL:", erro);
      return res.status(500).json({ erro: "Erro no banco" });
    }

    res.json({ ok: true, id: resultado.insertId });
  });
});

// 🧠 Memória simples
const sessions = {};

// 🤖 Prompt da Nina
const SYSTEM_PROMPT = `
Você é Nina, uma assistente virtual inteligente, simpática e prestativa.
Responda sempre em português brasileiro de forma clara e amigável.
Nunca diga que é uma IA genérica — você é a Nina.
Seja objetiva, mas com um toque de simpatia.
`;

// CHAT
app.post("/chat", async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message) {
    return res.status(400).json({ erro: "Mensagem obrigatória" });
  }

  const id = sessionId || uuidv4();

  if (!sessions[id]) {
    sessions[id] = [
      { role: "system", content: SYSTEM_PROMPT }
    ];
  }

  sessions[id].push({ role: "user", content: message });

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat",
      {
        model: "llama-3.1-8b-instant",
        messages: sessions[id],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply =
      response.data?.choices?.[0]?.message?.content ||
      "Erro ao gerar resposta";

    sessions[id].push({
      role: "assistant",
      content: reply
    });

    res.json({ reply, sessionId: id });

  } catch (err) {
    console.error("🔥 ERRO REAL:");
    console.error(err.response?.data || err.message);

    res.status(500).json({
      error: "Erro no chat",
      detalhe: err.response?.data || err.message
    });
  }
});

// START
const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Nina rodando em http://localhost:${PORT}`);
});