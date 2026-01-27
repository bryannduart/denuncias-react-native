import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";

export default function Home() {
  async function handleLogout() {
    await AsyncStorage.removeItem("token");
    Alert.alert("Saiu", "Você saiu da conta.");
    router.replace("/auth/login");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center" }}>
        Menu
      </Text>

      <Pressable
        onPress={() => router.push("/form")}
        style={{
          padding: 16,
          borderWidth: 1,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text>Criar denúncia</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/list")}
        style={{
          padding: 16,
          borderWidth: 1,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text>Ver denúncias</Text>
      </Pressable>

      {/* LOGOUT */}
      <Pressable
        onPress={handleLogout}
        style={{
          padding: 16,
          borderRadius: 10,
          alignItems: "center",
          backgroundColor: "#b00020",
          marginTop: 20,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Sair</Text>
      </Pressable>
    </View>
  );
}
