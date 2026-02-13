const amqp = require("amqplib");
const { Buffer } = require("buffer");
const { logInfo, logError } = require("./logger");

let connection = null;
let channel = null;

async function getChannel() {
  if (channel) return channel;

  const url = process.env.RABBITMQ_URL;
  const queue = process.env.RABBITMQ_QUEUE || "denuncias";

  if (!url) throw new Error("RABBITMQ_URL não definido");

  connection = await amqp.connect(url);

  connection.on("error", (err) => {
    logError("RabbitMQ publisher error", { error: err.message });
  });

  connection.on("close", () => {
    logError("RabbitMQ publisher connection closed. Resetando...");
    connection = null;
    channel = null;
  });

  channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: true });

  logInfo("Publisher RabbitMQ pronto.", { queue });
  return channel;
}

async function publishToQueue(payload) {
  const queue = process.env.RABBITMQ_QUEUE || "denuncias";
  const ch = await getChannel();

  const sent = ch.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
    persistent: true,
  });

  if (!sent) {
    logError("sendToQueue retornou false (buffer cheio).");
  }

  return true;
}

module.exports = { publishToQueue };
