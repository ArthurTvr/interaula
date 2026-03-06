import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";

export default function ProfessorPainel() {
  const { codigo } = useParams();

  const [sessao, setSessao] = useState(null);
  const [atividade, setAtividade] = useState(null);
  const [respostas, setRespostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let unsubRespostas = null;

    async function carregar() {
      try {
        setErro("");
        setLoading(true);

        // 1) Carrega sessão
        const sessaoRef = doc(db, "sessions", codigo);
        const snapSessao = await getDoc(sessaoRef);

        if (!snapSessao.exists()) {
          setErro("Sessão não encontrada.");
          setLoading(false);
          return;
        }

        const sessaoData = snapSessao.data();
        setSessao(sessaoData);

        // 2) Carrega atividade
        const atvRef = doc(db, "activities", sessaoData.activityId);
        const snapAtv = await getDoc(atvRef);

        if (!snapAtv.exists()) {
          setErro("Atividade não encontrada para esta sessão.");
          setLoading(false);
          return;
        }

        setAtividade({ id: snapAtv.id, ...snapAtv.data() });

        // 3) Escuta respostas em tempo real
        const respostasRef = collection(db, "sessions", codigo, "respostas");
        const q = query(respostasRef, orderBy("createdAt", "asc"));

        unsubRespostas = onSnapshot(
          q,
          (snapshot) => {
            const lista = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
            setRespostas(lista);
            setLoading(false);
          },
          (err) => {
            console.error("onSnapshot erro:", err);
            setErro("Falha ao ouvir respostas (ver regras do Firestore).");
            setLoading(false);
          }
        );
      } catch (err) {
        console.error("Erro no painel:", err);
        setErro("Erro ao carregar painel do professor.");
        setLoading(false);
      }
    }

    carregar();

    return () => {
      if (unsubRespostas) unsubRespostas();
    };
  }, [codigo]);

  const total = respostas.length;

  const respostasNormalizadas = useMemo(() => {
    // Compatível com:
    // - antigo: { respostas: {0:"", 1:""} }
    // - novo:   { answers: [{questionIndex, answer}, ...] }
    return respostas.map((r) => {
      let answersArr = [];

      if (Array.isArray(r.answers)) {
        answersArr = r.answers;
      } else if (r.respostas && typeof r.respostas === "object") {
        answersArr = Object.keys(r.respostas).map((k) => ({
          questionIndex: Number(k),
          answer: r.respostas[k],
        }));
      }

      return {
        id: r.id,
        aluno: r.aluno || "Aluno",
        answers: answersArr,
        createdAt: r.createdAt,
      };
    });
  }, [respostas]);

  if (loading) {
    return <p className="p-6">Carregando painel…</p>;
  }

  if (erro) {
    return (
      <div className="p-6">
        <p className="text-red-600 font-semibold">{erro}</p>
        <p className="text-gray-600 mt-2">
          Dica: abra o Console (F12) e veja o erro exato.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Painel da Sessão
            </h2>
            <p className="text-gray-600">
              Atividade: <strong>{atividade?.title}</strong>
            </p>
            <p className="text-gray-600">
              Respostas recebidas: <strong>{total}</strong>
            </p>
          </div>

          <div className="bg-indigo-100 text-indigo-800 px-4 py-3 rounded-xl text-center">
            <p className="text-xs">Código da sala</p>
            <p className="text-2xl font-bold tracking-widest">{codigo}</p>
          </div>
        </div>

        {total === 0 ? (
          <p className="text-gray-500">Aguardando respostas dos alunos…</p>
        ) : (
          <div className="space-y-4">
            {respostasNormalizadas.map((r, idx) => (
              <div key={r.id} className="border rounded-xl p-4">
                <p className="font-semibold text-gray-800 mb-2">
                  {r.aluno} #{idx + 1}
                </p>

                {atividade?.questions?.map((q, qi) => {
                  const achada = r.answers.find((a) => a.questionIndex === qi);
                  return (
                    <div key={qi} className="text-sm mb-2">
                      <p className="text-gray-700">
                        <strong>{qi + 1}.</strong> {q.text}
                      </p>
                      <p className="text-gray-600">
                        Resposta: {achada?.answer ?? "-"}
                      </p>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}