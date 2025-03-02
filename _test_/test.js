require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const Recorder = require("../avlogs");

const logger = new Recorder();

console.log("\n--- Logging test started ---\n");

logger.info("Application started successfully");
logger.debug("Debugging mode active");
logger.warn("Low memory warning");
logger.error("Unhandled exception occurred");

console.log("\n--- Logging test completed ---\n");
