import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Aluno() {
  const [nome, setNome] = useState(localStorage.getItem("nomeAluno") || "");
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  const entrarNaSala = async () => {
    const nomeFormatado = nome.trim();
    const codigoFormatado = codigo.trim().toUpperCase();

    if (!nomeFormatado) {
      setErro("Informe seu nome");
      return;
    }

    if (!codigoFormatado) {
      setErro("Informe o código da sala");
      return;
    }

    try {
      setLoading(true);
      setErro("");

      // salva o nome uma única vez
      localStorage.setItem("nomeAluno", nomeFormatado);

      // valida se a sessão existe
      const ref = doc(db, "sessions", codigoFormatado);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setErro("Sala não encontrada ou encerrada");
        return;
      }

      // ✅ entra na sala
      navigate(`/aluno/${codigoFormatado}`);

    } catch (err) {
      console.error(err);
      setErro("Erro ao entrar na sala");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 text-center">

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Entrar na Aula
        </h2>

        <p className="text-gray-500 mb-6">
          Digite seu nome e o código fornecido pelo professor
        </p>

        {erro && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">
            {erro}
          </div>
        )}

        <input
          type="text"
          placeholder="Seu nome"
          className="w-full border border-gray-300 rounded-lg px-3 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          type="text"
          placeholder="Ex: A1B2C3"
          className="w-full text-center tracking-widest uppercase border border-gray-300 rounded-lg px-3 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />

        <button
          onClick={entrarNaSala}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

      </div>
    </div>
  );
}