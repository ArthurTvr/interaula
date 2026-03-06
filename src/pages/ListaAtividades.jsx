import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { criarSessao } from "../services/sessions";

export default function ListaAtividades() {
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [iniciandoId, setIniciandoId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function carregar() {
      try {
        const q = query(collection(db, "activities"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);

        const lista = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAtividades(lista);
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar atividades");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  async function iniciarSessao(activityId) {
    try {
      setIniciandoId(activityId);

      const codigo = await criarSessao(activityId);

      // ✅ abre a tela só com o código (para projetar)
      window.open(`${window.location.origin}/professor/codigo/${codigo}`, "_blank");

      // ✅ vai para o painel da sessão (respostas em tempo real)
      navigate(`/professor/painel/${codigo}`);
    } catch (error) {
      console.error(error);
      alert("Erro ao iniciar sessão");
    } finally {
      setIniciandoId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Minhas Atividades</h2>

        {loading && <p>Carregando...</p>}

        {!loading && atividades.length === 0 && (
          <p className="text-gray-500">Nenhuma atividade criada ainda.</p>
        )}

        <div className="space-y-4">
          {atividades.map((atv) => (
            <div
              key={atv.id}
              className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:shadow-md transition"
            >
              <div>
                <h3 className="font-semibold text-gray-800">{atv.title}</h3>
                <p className="text-sm text-gray-500">{atv.questions?.length || 0} perguntas</p>
                <p className="text-xs text-gray-400 mt-1">Tipo: {atv.type}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => iniciarSessao(atv.id)}
                  disabled={iniciandoId === atv.id}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-60"
                >
                  {iniciandoId === atv.id ? "Iniciando..." : "Iniciar Sessão"}
                </button>

                <button
                  onClick={() => navigate(`/professor/respostas/atividade/${atv.id}`)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Ver Respostas
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}