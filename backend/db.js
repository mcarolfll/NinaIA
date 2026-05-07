const mysql = require("mysql2");
const url = require("url");

let conexao;

if (process.env.DATABASE_URL) {
  // Parse da URL do Railway
  const dbUrl = url.parse(process.env.DATABASE_URL);
  
  conexao = mysql.createConnection({
    host: dbUrl.hostname,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),
    port: dbUrl.port || 3306
  });
} else {
  // Fallback para desenvolvimento local
  conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "NinaIA"
  });
}

conexao.connect((erro) => {
  if (erro) {
    console.error("Erro ao conectar no MySQL:", erro);
    return;
  }
  console.log("Conectado ao MySQL!");
});

module.exports = conexao;