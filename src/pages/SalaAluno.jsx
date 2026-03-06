import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

export default function SalaAluno() {
  const { codigo } = useParams();
  const [atividade, setAtividade] = useState(null);
  const [respostas, setRespostas] = useState({});
  const [loading, setLoading] = useState(true);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const refSessao = doc(db, "sessions", codigo);
        const snapSessao = await getDoc(refSessao);

        if (!snapSessao.exists()) {
          alert("Sessão não encontrada");
          return;
        }

        const snapAtv = await getDoc(
          doc(db, "activities", snapSessao.data().activityId)
        );

        if (!snapAtv.exists()) {
          alert("Atividade não encontrada");
          return;
        }

        setAtividade({ id: snapAtv.id, ...snapAtv.data() });
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar atividade");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [codigo]);

  if (loading) return <p className="p-6 text-center">Carregando atividade...</p>;
  if (!atividade) return null;

  const handleChange = (index, value) => {
    setRespostas((prev) => ({
      ...prev,
      [index]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const nomeAluno = (localStorage.getItem("nomeAluno") || "").trim();
      if (!nomeAluno) {
        alert("Seu nome não foi encontrado. Volte e entre novamente.");
        return;
      }

      const respostasFormatadas = Object.keys(respostas).map((key) => ({
        questionIndex: Number(key),
        answer: respostas[key]
      }));

      await addDoc(collection(db, "sessions", codigo, "respostas"), {
        aluno: nomeAluno,          // ✅ nome real
        activityId: atividade.id,
        answers: respostasFormatadas,
        createdAt: serverTimestamp()
      });

      setEnviado(true);
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar respostas");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6">

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {atividade.title}
        </h2>

        {enviado ? (
          <p className="text-green-600 font-semibold text-center">
            ✅ Respostas enviadas com sucesso!
          </p>
        ) : (
          <>
            {atividade.questions.map((q, i) => (
              <div key={i} className="mb-6">
                <p className="font-medium mb-2">
                  {i + 1}. {q.text}
                </p>

                {/* ESCRITA ou CHUVA */}
                {(atividade.type === "escrita" || atividade.type === "chuva") && (
                  <textarea
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                    value={respostas[i] || ""}
                    onChange={(e) => handleChange(i, e.target.value)}
                  />
                )}

                {/* MULTIPLA ESCOLHA */}
                {atividade.type === "multipla" &&
                  q.options?.map((op, idxOp) => (
                    <label key={idxOp} className="block mb-1">
                      <input
                        type="radio"
                        name={`pergunta-${i}`}
                        value={op}
                        checked={respostas[i] === op}
                        onChange={(e) => handleChange(i, e.target.value)}
                      />{" "}
                      {op}
                    </label>
                  ))}
              </div>
            ))}

            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Enviar Respostas
            </button>
          </>
        )}
      </div>
    </div>
  );
}