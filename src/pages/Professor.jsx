import { useNavigate } from "react-router-dom";

export default function Professor() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Painel do Professor
        </h2>

        <div className="space-y-4">

          {/* Criar atividade */}
          <button
            onClick={() => navigate("/professor/criar-atividade")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Criar Nova Atividade
          </button>
          {/* Gerenciar atividades */}
          <button
            onClick={() => navigate("/professor/atividades")}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Minhas Atividades
          </button>

        </div>

      </div>
    </div>
  );
}