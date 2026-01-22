import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { insertDenuncia } from "../src/database/database";
import {
  hasAtLeastTwoNames,
  isValidAge,
  isValidCEP,
  isValidCPF,
  onlyDigits,
} from "../src/utils/validators";

export default function Form() {
  // Campos
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [idade, setIdade] = useState("");

  const [sexo, setSexo] = useState(""); // "Masculino" | "Feminino"

  // Localização
  const [endereco, setEndereco] = useState("");
  const [cep, setCep] = useState("");
  const [complemento, setComplemento] = useState("");

  function validateAll() {
    const cpfDigits = onlyDigits(cpf);
    const cepDigits = onlyDigits(cep);

    if (!nome.trim()) return "Preencha o nome.";
    if (!hasAtLeastTwoNames(nome))
      return "Informe nome e sobrenome (pelo menos 2 palavras).";

    if (!cpfDigits) return "Preencha o CPF.";
    if (!isValidCPF(cpfDigits))
      return "CPF inválido. Verifique e tente novamente.";

    if (!isValidAge(idade)) return "Idade inválida. Digite um número válido.";

    if (!sexo) return "Selecione o sexo.";

    if (!endereco.trim()) return "Preencha o endereço.";
    if (!isValidCEP(cepDigits))
      return "CEP inválido. Digite um CEP válido (8 números).";

    return null;
  }

  async function handleSubmit() {
    const error = validateAll();
    if (error) {
      Alert.alert("Atenção", error);
      return;
    }

    try {
      await insertDenuncia({
        nome: nome.trim(),
        cpf: onlyDigits(cpf),
        idade: Number(onlyDigits(idade)),
        sexo,
        endereco: endereco.trim(),
        cep: onlyDigits(cep),
        complemento: complemento.trim(),
      });

      Alert.alert("Sucesso", "Denúncia salva!");

      // limpar campos
      setNome("");
      setCpf("");
      setIdade("");
      setSexo("");
      setEndereco("");
      setCep("");
      setComplemento("");

      // ir pra listagem pra ver o resultado
      router.push("/list");
    } catch (e) {
      console.log(e);
      Alert.alert("Erro", "Não foi possível salvar a denúncia.");
    }
  }

  const inputStyle = {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  };

  const sectionStyle = {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 10,
  };

  const buttonStyle = (active) => ({
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: active ? "#ddd" : "transparent",
  });

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Criar denúncia</Text>

      <Text>Nome completo</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        placeholder="Ex: João da Silva"
        style={inputStyle}
      />

      <Text>CPF (apenas números)</Text>
      <TextInput
        value={cpf}
        onChangeText={(t) => setCpf(onlyDigits(t))}
        placeholder="Ex: 12345678909"
        keyboardType="numeric"
        style={inputStyle}
        maxLength={11}
      />

      <Text>Idade</Text>
      <TextInput
        value={idade}
        onChangeText={(t) => setIdade(onlyDigits(t))}
        placeholder="Ex: 25"
        keyboardType="numeric"
        style={inputStyle}
        maxLength={3}
      />

      <Text>Sexo</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable
          style={buttonStyle(sexo === "Masculino")}
          onPress={() => setSexo("Masculino")}
        >
          <Text>Masculino</Text>
        </Pressable>
        <Pressable
          style={buttonStyle(sexo === "Feminino")}
          onPress={() => setSexo("Feminino")}
        >
          <Text>Feminino</Text>
        </Pressable>
      </View>

      <View style={sectionStyle}>
        <Text style={{ fontWeight: "bold" }}>Localização</Text>

        <Text>Endereço</Text>
        <TextInput
          value={endereco}
          onChangeText={setEndereco}
          placeholder="Rua, número, bairro"
          style={inputStyle}
        />

        <Text>CEP</Text>
        <TextInput
          value={cep}
          onChangeText={(t) => setCep(onlyDigits(t))}
          placeholder="Ex: 01001000"
          keyboardType="numeric"
          style={inputStyle}
          maxLength={8}
        />

        <Text>Complemento</Text>
        <TextInput
          value={complemento}
          onChangeText={setComplemento}
          placeholder="Apto, bloco, referência (opcional)"
          style={inputStyle}
        />
      </View>

      <Pressable
        onPress={handleSubmit}
        style={{
          padding: 16,
          borderWidth: 1,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text>Enviar</Text>
      </Pressable>
    </ScrollView>
  );
}
