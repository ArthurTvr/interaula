import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function ProfessorRespostas({ activityId }) {

  const [respostas, setRespostas] = useState([]);

  useEffect(() => {

    const q = query(
      collection(db, "activityResponses"),
      where("activityId", "==", activityId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRespostas(lista);
    });

    return () => unsubscribe();

  }, [activityId]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Respostas em Tempo Real
      </h2>

      {respostas.map((r) => (
        <div key={r.id} className="border p-3 mb-3 rounded">

          <p className="font-semibold">
            Aluno: {r.studentName}
          </p>

          {r.answers.map((a, i) => (
            <p key={i}>
              Pergunta {a.questionIndex + 1}: {a.answer}
            </p>
          ))}

        </div>
      ))}
    </div>
  );
}