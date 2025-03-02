require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const Avlogs = require("../avlogs");

const avlogs = new Avlogs();

console.log("\n--- Logging test started ---\n");

avlogs.info("Application started successfully");
avlogs.debug("Debugging mode active");
avlogs.warn("Low memory warning");
avlogs.error("Unhandled exception occurred");

console.log("\n--- Logging test completed ---\n");
