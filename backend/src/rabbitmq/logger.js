function logInfo(message, meta) {
  console.log(`[RABBITMQ][INFO] ${message}`, meta || "");
}

function logWarn(message, meta) {
  console.warn(`[RABBITMQ][WARN] ${message}`, meta || "");
}

function logError(message, meta) {
  console.error(`[RABBITMQ][ERROR] ${message}`, meta || "");
}

module.exports = { logInfo, logWarn, logError };
