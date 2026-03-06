import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Professor from "./pages/Professor";
import Home from "./pages/Home";
import Aluno from "./pages/Aluno";
import SalaAluno from "./pages/SalaAluno";
import CriarAtividade from "./pages/CriarAtividade";
import ListaAtividades from "./pages/ListaAtividades";
import IniciarSessao from "./pages/IniciarSessao";
import ProfessorPainel from "./pages/ProfessorPainel";
import ProfessorRespostas from "./pages/ProfessorRespostas";
import RespostasAtividade from "./pages/RespostasAtividade";
import CodigoSala from "./pages/codigoSala";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/professor" element={<Professor />} />
        <Route path="/aluno" element={<Aluno />} />
        <Route path="/aluno/:codigo" element={<SalaAluno />} />
        <Route path="/professor/criar-atividade" element={<CriarAtividade />} />
        <Route path="/professor/atividades" element={<ListaAtividades />} />
        <Route path="/professor/iniciar/:activityId" element={<IniciarSessao />} />
        <Route path="/professor/painel/:codigo" element={<ProfessorPainel />} />
        <Route path="/professor/respostas/:activityId" element={<ProfessorRespostas />} />
        <Route path="/professor/respostas/atividade/:activityId" element={<RespostasAtividade />} />
        <Route path="/codigo-sala" element={<CodigoSala />} />

      </Routes>
    </BrowserRouter>
  );
}