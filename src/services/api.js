import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = "http://192.168.1.6:3333";

// Helper: pega o token salvo
async function getToken() {
  return AsyncStorage.getItem("token");
}

// Helper: faz request já colocando JSON + token (se existir)
async function request(path, { method = "GET", body } = {}) {
  const token = await getToken();

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // erro de rede / IP errado / porta bloqueada
    throw new Error(
      "Não foi possível conectar ao servidor. Verifique o IP e se a API está ligada.",
    );
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.error || "Falha na requisição.";
    throw new Error(msg);
  }

  return data;
}

// Funções prontas pra usar no app
export async function login(email, password) {
  const data = await request("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  // Se o backend NÃO mandou token, não salva e avisa
  if (!data?.token) {
    throw new Error("Login falhou: o servidor não retornou o token.");
  }

  await AsyncStorage.setItem("token", data.token);
  return data.token;
}

export async function listarDenuncias() {
  return request("/denuncias");
}

export async function criarDenuncia(payload) {
  return request("/denuncias", { method: "POST", body: payload });
}

export async function atualizarDenuncia(id, payload) {
  return request(`/denuncias/${id}`, { method: "PUT", body: payload });
}

export async function deletarDenuncia(id) {
  return request(`/denuncias/${id}`, { method: "DELETE" });
}

export async function logout() {
  await AsyncStorage.removeItem("token");
}

export async function tryCriarDenuncia(payload) {
  try {
    await criarDenuncia(payload);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
