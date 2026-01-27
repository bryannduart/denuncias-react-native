import { Stack } from "expo-router";
import { useEffect } from "react";
import { createTables } from "../src/database/database";

export default function RootLayout() {
  useEffect(() => {
    (async () => {
      try {
        await createTables();
      } catch (e) {
        console.log("ERRO createTables:", e);
      }
    })();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="auth/login" options={{ title: "Tela de Acesso" }} />
      <Stack.Screen name="home" options={{ title: "Início" }} />
      <Stack.Screen name="form" options={{ title: "Criar denúncia" }} />
      <Stack.Screen name="list" options={{ title: "Ver denúncias" }} />
    </Stack>
  );
}
