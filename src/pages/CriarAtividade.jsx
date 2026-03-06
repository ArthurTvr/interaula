import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function CriarAtividade() {
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState(""); // NOVO
  const [pergunta, setPergunta] = useState("");
  const [opcao, setOpcao] = useState("");
  const [opcoes, setOpcoes] = useState([]);
  const [perguntas, setPerguntas] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const adicionarOpcao = () => {
    if (!opcao.trim()) return;
    setOpcoes([...opcoes, opcao]);
    setOpcao("");
  };

  const adicionarPergunta = () => {
    if (!pergunta.trim()) return;

    const novaPergunta = {
      text: pergunta,
      ...(tipo === "multipla" && { options: opcoes })
    };

    setPerguntas([...perguntas, novaPergunta]);
    setPergunta("");
    setOpcoes([]);
  };

  const salvarAtividade = async () => {
    if (!titulo || !tipo || perguntas.length === 0) {
      alert("Preencha título, tipo e pelo menos uma pergunta");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "activities"), {
        title: titulo,
        type: tipo,
        questions: perguntas,
        createdAt: serverTimestamp()
      });

      alert("Atividade criada com sucesso!");
      navigate("/professor");

    } catch (error) {
      console.error(error);
      alert("Erro ao criar atividade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6">

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Criar Atividade
        </h2>

        {/* Título */}
        <input
          type="text"
          placeholder="Título da atividade"
          className="w-full border rounded-lg px-3 py-2 mb-4"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        {/* Tipo */}
        <select
          className="w-full border rounded-lg px-3 py-2 mb-4"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="">Selecione o tipo</option>
          <option value="chuva">🧠 Chuva de ideias</option>
          <option value="escrita">✍️ Resposta escrita</option>
          <option value="multipla">✅ Múltipla escolha</option>
        </select>

        {/* Pergunta */}
        <input
          type="text"
          placeholder="Digite a pergunta"
          className="w-full border rounded-lg px-3 py-2 mb-2"
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
        />

        {/* Opções (só se for múltipla escolha) */}
        {tipo === "multipla" && (
          <div className="mb-4">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Opção"
                className="flex-1 border rounded-lg px-3 py-2"
                value={opcao}
                onChange={(e) => setOpcao(e.target.value)}
              />
              <button
                onClick={adicionarOpcao}
                className="bg-indigo-600 text-white px-4 rounded-lg"
              >
                +
              </button>
            </div>

            {opcoes.map((o, i) => (
              <div key={i} className="text-sm bg-gray-100 p-1 rounded">
                {o}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={adicionarPergunta}
          className="w-full bg-blue-600 text-white py-2 rounded-lg mb-4"
        >
          Adicionar Pergunta
        </button>

        {/* Lista de perguntas */}
        <div className="space-y-2 mb-6">
          {perguntas.map((p, index) => (
            <div key={index} className="bg-gray-100 p-2 rounded-lg text-sm">
              {index + 1}. {p.text}
            </div>
          ))}
        </div>

        <button
          onClick={salvarAtividade}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg"
        >
          {loading ? "Salvando..." : "Salvar Atividade"}
        </button>

      </div>
    </div>
  );
}