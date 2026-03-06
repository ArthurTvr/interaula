import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { criarSessao } from "../services/sessions";

export default function IniciarSessao() {
  const { activityId } = useParams();
  const [atividade, setAtividade] = useState(null);
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      const ref = doc(db, "activities", activityId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setAtividade(snap.data());
      } else {
        alert("Atividade não encontrada");
      }

      setLoading(false);
    }

    carregar();
  }, [activityId]);

  const iniciar = async () => {
    // ✅ Cria sessão com currentQuestionIndex = 0
    const code = await criarSessao(activityId);
    setCodigo(code);
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 text-center">

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Iniciar Sessão
        </h2>

        <p className="text-gray-600 mb-6">
          {atividade?.title}
        </p>

        {!codigo && atividade?.questions?.length > 0 && (
          <button
            onClick={iniciar}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Iniciar Sessão
          </button>
        )}

        {codigo && (
          <div className="mt-4 bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-500">Código da sala</p>
            <h3 className="text-2xl font-bold tracking-widest text-indigo-700">
              {codigo}
            </h3>
          </div>
        )}

        {!codigo && atividade?.questions?.length === 0 && (
          <p className="text-gray-500">
            Adicione perguntas antes de iniciar a sessão
          </p>
        )}

      </div>
    </div>
  );
}