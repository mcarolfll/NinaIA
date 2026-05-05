import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const resposta = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          senha
        })
      });

      const dados = await resposta.json();

      console.log(dados);

      if (resposta.ok) {
        navigate("/chat");
      } else {
        alert(dados.erro);
      }

    } catch (erro) {
      console.error("Erro:", erro);
      alert("Erro ao conectar com o servidor");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      
      <div className="bg-white border border-gray-200 rounded-xl shadow-md w-full max-w-md">
        
        <div className="p-6">
          
          <div className="text-center">
            <h3 className="text-2xl font-bold text-black">Login</h3>
          </div>

          <div className="mt-5">
            <form onSubmit={handleLogin}>
              <div className="grid gap-y-4">

                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border"
                    required
                  />
                </div>

                <div>
                  <label>Senha</label>
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full border"
                    required
                  />
                </div>

                <button type="submit">
                  Entrar
                </button>

              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}