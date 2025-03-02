/*
 * Recorder: A custom logging utility with support for log rotation, structured logging, and configurable log storage.
 *
 * Features:
 * - Supports log levels: debug, info, warn, error.
 * - Writes logs to files based on severity or all combined.
 * - Logs can be rotated based on size, daily, weekly, or monthly settings.
 * - Reads configurations from a .env file in the project root.
 * - Logs include timestamps and package name.
 * - Supports console logging as an option.
 */

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from the project's root .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

class Recorder {
  constructor() {
    // Define log levels with their severity
    this.levels = { debug: 0, info: 1, warn: 2, error: 3 };
    this.level = process.env.LOG_LEVEL || "info"; // Default log level

    // Define log directory and file names
    this.logDir = process.env.LOG_DIR || "logs";
    this.errorWarnFile = process.env.LOG_FILE_ERROR_WARN || "errors.log";
    this.infoDebugFile = process.env.LOG_FILE_INFO_DEBUG || "info_debug.log";
    this.allLogsFile = process.env.LOG_FILE_ALL || "combined.log";

    // Define log file size limit and rotation strategy
    this.maxSize = parseInt(process.env.LOG_MAX_SIZE, 10) || 1024 * 1024; // Default 1MB
    this.rotationStrategy = process.env.LOG_ROTATION || "size"; // Rotation strategies: "size", "daily", "weekly", "monthly"
    this.console = process.env.LOG_CONSOLE !== "false"; // Console logging enabled by default

    // Fetch package name from package.json
    this.packageName = this.getPackageName();

    // Ensure log directory exists
    this.ensureLogDir();
  }

  // Ensure the log directory exists, create it if not
  ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  // Retrieve package name from package.json
  getPackageName() {
    try {
      const packageJson = require(path.resolve(process.cwd(), "package.json"));
      return packageJson.name || "unknown-package";
    } catch (error) {
      return "unknown-package";
    }
  }

  // Determine if log file rotation is needed
  shouldRotate(filePath) {
    if (this.rotationStrategy === "size") {
      return (
        fs.existsSync(filePath) && fs.statSync(filePath).size >= this.maxSize
      );
    } else {
      const fileStats = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
      if (!fileStats) return false;
      const now = new Date();
      const lastModified = new Date(fileStats.mtime);

      // Check time-based rotation
      if (
        this.rotationStrategy === "daily" &&
        now.getDate() !== lastModified.getDate()
      )
        return true;
      if (
        this.rotationStrategy === "weekly" &&
        now - lastModified >= 7 * 24 * 60 * 60 * 1000
      )
        return true;
      if (
        this.rotationStrategy === "monthly" &&
        now.getMonth() !== lastModified.getMonth()
      )
        return true;
    }
    return false;
  }

  // Rotate logs by renaming the old log file
  rotateLogs(filePath) {
    if (this.shouldRotate(filePath)) {
      const rotatedFile = `${filePath}.${Date.now()}.bak`;
      fs.renameSync(filePath, rotatedFile);
    }
  }

  // General log function to write logs to files and console
  log(level, message, meta = {}) {
    if (this.levels[level] >= this.levels[this.level]) {
      const timestamp = new Date().toISOString();
      const logEntry = `[${this.packageName}] ${timestamp} [${level.toUpperCase()}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;

      if (this.console) console.log(logEntry);

      let logFile;

      // Determine which file to log to based on environment settings
      if (process.env.LOG_COMBINATION === "all") {
        logFile = path.join(this.logDir, this.allLogsFile);
      } else if (process.env.LOG_COMBINATION === "error_warn") {
        logFile =
          level === "error" || level === "warn"
            ? path.join(this.logDir, this.errorWarnFile)
            : path.join(this.logDir, this.infoDebugFile);
      } else {
        logFile = path.join(this.logDir, this.allLogsFile);
      }

      // Perform log rotation if needed and append log entry
      this.rotateLogs(logFile);
      fs.appendFileSync(logFile, logEntry + "\n");
    }
  }

  // Log functions for different levels
  debug(msg, meta = {}) {
    this.log("debug", msg, meta);
  }
  info(msg, meta = {}) {
    this.log("info", msg, meta);
  }
  warn(msg, meta = {}) {
    this.log("warn", msg, meta);
  }
  error(msg, meta = {}) {
    this.log("error", msg, meta);
  }
}

module.exports = Recorder;
