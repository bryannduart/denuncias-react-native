const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  // 1) Pega o header Authorization
  const authHeader = req.headers.authorization;

  // 2) Se não veio header, já bloqueia
  if (!authHeader) {
    return res.status(401).json({ error: "Token não informado." });
  }

  // 3) O formato correto é: "Bearer TOKEN_AQUI"
  const [type, token] = authHeader.split(" ");

  // 4) Se não for Bearer ou token estiver vazio, bloqueia
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "Token mal formatado." });
  }

  try {
    // 5) Valida o token com a mesma chave do login (JWT_SECRET)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 6) Guarda infos do usuário dentro do req (pra usar nas rotas depois)
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };

    // 7) Libera a requisição pra rota continuar
    return next();
  } catch {
    // 8) Se token expirou ou é inválido
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}

module.exports = auth;
