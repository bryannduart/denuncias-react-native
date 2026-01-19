import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Index() {
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
    </View>
  );
}
