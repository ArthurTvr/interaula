export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 text-center">

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Interaula
        </h1>

        <p className="text-gray-500 mb-6">
          Aprendizado interativo em tempo real
        </p>

        <div className="space-y-3">
          <a
            href="/login"
            className="block w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Sou Professor
          </a>

          <a
            href="/aluno"
            className="block w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Sou Aluno
          </a>
        </div>

      </div>
    </div>
  );
}