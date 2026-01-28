const amqp = require("amqplib");
const { logInfo, logError } = require("./logger");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectWithRetry({ url, maxDelayMs = 30000 }) {
  let attempt = 0;

  while (true) {
    attempt += 1;
    try {
      logInfo(`Conectando no RabbitMQ (tentativa ${attempt})...`, { url });

      const connection = await amqp.connect(url);

      connection.on("error", (err) => {
        logError("RabbitMQ connection error event.", { error: err.message });
      });

      connection.on("close", () => {
        logError("RabbitMQ connection close event.");
      });

      logInfo("RabbitMQ conectado!");
      return connection;
    } catch (err) {
      const delay = Math.min(1000 * Math.pow(2, attempt), maxDelayMs);
      logError("Falhou conectar no RabbitMQ. Tentarei novamente.", {
        error: err.message,
        nextRetryMs: delay,
      });
      await sleep(delay);
    }
  }
}

module.exports = { connectWithRetry };
