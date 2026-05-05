const mysql = require("mysql2");

const conexao = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "NinaIA"
});

conexao.connect((erro) => {
  if (erro) {
    console.error("Erro ao conectar no MySQL:", erro);
    return;
  }
  console.log("Conectado ao MySQL!");
});

module.exports = conexao;