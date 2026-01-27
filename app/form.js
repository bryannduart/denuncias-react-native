import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { insertDenuncia } from "../src/database/database";
import {
  hasAtLeastTwoNames,
  isValidAge,
  isValidCEP,
  isValidCPF,
  onlyDigits,
} from "../src/utils/validators";

import { Picker } from "@react-native-picker/picker";
import { MaskedTextInput } from "react-native-mask-text";

export default function Form() {
  // Para respeitar o limite da barra do celular
  const insets = useSafeAreaInsets();

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

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            gap: 12,
            paddingBottom: 80, // espaço reservado pro rodapé fixo
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Criar denúncia
          </Text>

          <Text>Nome completo</Text>
          <TextInput
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: João da Silva"
            style={inputStyle}
          />

          <Text>CPF (apenas números)</Text>
          <MaskedTextInput
            mask="999.999.999-99"
            value={cpf}
            onChangeText={(text) => setCpf(text)}
            keyboardType="numeric"
            placeholder="Ex: 123.456.789-09"
            style={inputStyle}
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
          <View
            style={{ borderWidth: 1, borderRadius: 10, overflow: "hidden" }}
          >
            <Picker
              selectedValue={sexo}
              onValueChange={(value) => setSexo(value)}
            >
              <Picker.Item label="Selecione..." value="" />
              <Picker.Item label="Masculino" value="Masculino" />
              <Picker.Item label="Feminino" value="Feminino" />
            </Picker>
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
            <MaskedTextInput
              mask="99999-999"
              value={cep}
              onChangeText={(text) => setCep(text)}
              keyboardType="numeric"
              placeholder="Ex: 01001-000"
              style={inputStyle}
            />

            <Text>Complemento</Text>
            <TextInput
              value={complemento}
              onChangeText={setComplemento}
              placeholder="Apto, bloco, referência (opcional)"
              style={inputStyle}
            />
          </View>
        </ScrollView>

        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: insets.bottom,
            borderTopWidth: 1,
            backgroundColor: "white",
          }}
        >
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
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
