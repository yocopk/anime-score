"use server";
import { db } from "@/lib/prisma";
export async function actionSyncUser(email: string) {
  // Estrarre il corpo della richiesta come JSON
  // Verifica se l'email è presente
  if (!email) {
    return { error: "Email is required" };
  }
  // Verifica se l'utente esiste già nel DB
  const user = await db.user.findUnique({
    where: { email },
  });
  // Se l'utente esiste, ritorna un errore
  if (user) {
    return { error: "User already exists" };
  }
  // Crea un nuovo utente nel DB
  await db.user.create({
    data: {
      email,
    },
  });
  // Rispondi con successo
  return { message: "User created successfully" };
}
