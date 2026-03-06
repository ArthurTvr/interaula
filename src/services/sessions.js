import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function criarSessao(activityId) {
  console.log("criando sessão...");

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  await setDoc(doc(db, "sessions", code), {
    activityId,
    status: "active",
    createdAt: serverTimestamp()
  });

  console.log("sessão criada:", code);

  return code;
}