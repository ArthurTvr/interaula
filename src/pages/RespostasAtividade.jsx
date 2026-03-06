import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../firebase";

export default function RespostasAtividade() {
  const { activityId } = useParams();
  const [sessoes, setSessoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const q = query(
          collection(db, "sessions"),
          where("activityId", "==", activityId)
        );

        const snap = await getDocs(q);

        const lista = snap.docs.map(doc => ({
          codigo: doc.id,
          ...doc.data()
        }));

        setSessoes(lista);
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar respostas");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [activityId]);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <h2 className="text-2xl font-bold mb-6">
        Respostas da Atividade
      </h2>

      {loading && <p>Carregando...</p>}

      {!loading && sessoes.length === 0 && (
        <p>Nenhuma sessão encontrada para esta atividade.</p>
      )}

      <div className="space-y-4">
        {sessoes.map(sessao => (
          <div
            key={sessao.codigo}
            className="bg-white p-4 rounded-lg shadow"
          >
            <h3 className="font-semibold mb-2">
              Sessão: {sessao.codigo}
            </h3>

            <a
              href={`/professor/painel/${sessao.codigo}`}
              className="text-blue-600 underline"
            >
              Ver respostas dessa sessão
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}