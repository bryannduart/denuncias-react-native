const { connectWithRetry } = require("./connection");
const { handleDenunciaMessage } = require("./handler");
const { logInfo, logError } = require("./logger");

async function startConsumer() {
  const url = process.env.RABBITMQ_URL;
  const queue = process.env.RABBITMQ_QUEUE || "denuncias";

  if (!url) {
    logError("RABBITMQ_URL não definido. Consumer não iniciou.");
    return;
  }

  const connection = await connectWithRetry({ url });
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, { durable: true });
  await channel.prefetch(1);

  logInfo(`Consumer ativo. Escutando fila: ${queue}`);

  channel.consume(
    queue,
    async (msg) => {
      if (!msg) return;

      const content = msg.content.toString("utf-8");

      try {
        const result = await handleDenunciaMessage(content);

        if (result.ok) {
          channel.ack(msg);
          return;
        }

        channel.nack(msg, false, !!result.requeue);

        logError("Mensagem com erro (NACK).", {
          type: result.type,
          requeue: result.requeue,
          error: result.error,
        });
      } catch (err) {
        logError("Erro inesperado no consumer. NACK requeue=true", {
          error: err.message,
        });
        channel.nack(msg, false, true);
      }
    },
    { noAck: false },
  );

  // Se conexão cair, tenta reiniciar consumer
  connection.on("close", () => {
    logError("Conexão fechou. Reiniciando consumer em 2s...");
    setTimeout(() => startConsumer().catch(() => {}), 2000);
  });
}

module.exports = { startConsumer };
