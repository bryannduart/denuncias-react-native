import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    getPendingDenuncias,
    markAsSent,
    registerAttempt,
} from "../database/database";
import { tryCriarDenuncia } from "./api";

export async function syncPendingDenuncias() {
  const token = await AsyncStorage.getItem("token");
  if (!token) return;

  const pendentes = await getPendingDenuncias();

  for (const d of pendentes) {
    const payload = {
      nome: d.nome,
      cpf: d.cpf,
      idade: d.idade,
      sexo: d.sexo,
      endereco: d.endereco,
      cep: d.cep,
      complemento: d.complemento || "",
    };

    const result = await tryCriarDenuncia(payload);

    if (result.ok) {
      await markAsSent(d.id);
      console.log("Sync: enviada e marcada como SENT:", d.id);
    } else {
      await registerAttempt(d.id);
      console.log("Sync: falhou, mantida PENDING:", d.id, result.error);
    }
  }
}
