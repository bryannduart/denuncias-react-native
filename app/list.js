import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";

import { deleteDenuncia, getDenuncias } from "../src/database/database";
import { formatCEP, formatCPF } from "../src/utils/validators";

export default function List() {
  const [items, setItems] = useState([]);

  async function load() {
    try {
      const data = await getDenuncias();
      setItems(data);
    } catch (e) {
      console.log("LOAD ERROR:", e);
      Alert.alert("Erro", "Não foi possível carregar as denúncias.");
    }
  }

  // Recarrega sempre que a tela ganhar foco (ex: voltou do Form)
  useFocusEffect(
    useCallback(() => {
      load();
    }, []),
  );

  async function handleDelete(id) {
    Alert.alert("Confirmar", "Deseja apagar esta denúncia?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Apagar",
        style: "destructive",
        onPress: () => {
          (async () => {
            try {
              await deleteDenuncia(id);
              await load();
            } catch (e) {
              console.log("DELETE ERROR:", e);
              Alert.alert("Erro", "Não foi possível apagar a denúncia.");
            }
          })();
        },
      },
    ]);
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
        Denúncias cadastradas
      </Text>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text>Nenhuma denúncia encontrada.</Text>}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              borderRadius: 12,
              padding: 12,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              #{item.id} — {item.nome}
            </Text>
            <Text>CPF: {formatCPF(item.cpf)}</Text>
            <Text>Idade: {item.idade}</Text>
            <Text>Sexo: {item.sexo}</Text>
            <Text>Endereço: {item.endereco}</Text>
            <Text>CEP: {formatCEP(item.cep)}</Text>
            <Text>Complemento: {item.complemento || "-"}</Text>

            <Pressable
              onPress={() => handleDelete(item.id)}
              style={{
                marginTop: 10,
                padding: 12,
                borderWidth: 1,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text>Apagar</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
