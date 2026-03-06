import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      setLoading(true);
      setErro("");
      await signInWithEmailAndPassword(auth, email, senha);
      navigate("/professor");
    } catch (err) {
      setErro("E-mail ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Login Professor
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Acesse o painel da aula
        </p>

        {erro && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4 text-center">
            {erro}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={e => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={e => setSenha(e.target.value)}
          />

          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>

      </div>
    </div>
  );
}