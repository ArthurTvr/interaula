import { useParams, Link } from "react-router-dom";

export default function CodigoSala() {
  const { codigo } = useParams();

  if (!codigo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Código não informado.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-gray-300 text-xl mb-4">Código da sala</p>

        <h1 className="text-white text-7xl md:text-9xl font-extrabold tracking-widest">
          {codigo}
        </h1>

        <p className="text-gray-400 mt-6 text-lg">
          Os alunos entram em <span className="font-semibold">/aluno</span> e digitam o código
        </p>

        <div className="mt-8">
          <Link
            to={`/professor/painel/${codigo}`}
            className="inline-block bg-white text-black px-4 py-2 rounded-lg hover:opacity-90"
          >
            Voltar ao Painel
          </Link>
        </div>
      </div>
    </div>
  );
}