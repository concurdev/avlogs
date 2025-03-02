# recorder

A simple and configurable logging utility for Node.js applications. It supports different log levels, log rotation based on size or time, and configurable log file organization.

## Features

- Supports log levels: `debug`, `info`, `warn`, and `error`.
- Logs can be written to different files based on severity or combined into one file.
- Log rotation strategies: by size, daily, weekly, or monthly.
- Configurations are loaded from a `.env` file in the root directory.
- Logs include timestamps and the package name.
- Option to log messages to the console.

## Installation

```sh
git clone git@github.com:concurdev/log-recorder.git
cd log-recorder
npm install
```

## Configuration

Create a `.env` file in the root directory of your project with the following variables:

```ini
# Logging level: debug, info, warn, error
LOG_LEVEL=debug

# Directory where logs will be stored
LOG_DIR=logs

# Separate logs: Errors & Warnings in one file, Info & Debug in another
LOG_FILE_ERROR_WARN=errors.log
LOG_FILE_INFO_DEBUG=info_debug.log

# Combined log file (for all logs together)
LOG_FILE_ALL=combined.log

# Log rotation strategy: "size", "daily", "weekly", "monthly"
LOG_ROTATION=daily

# Maximum file size before rotation (in bytes)
LOG_MAX_SIZE=1048576  # 1MB

# Log to console? (true/false)
LOG_CONSOLE=true

# Log file combination mode:
# "all" = all logs in one file
# "error_warn" = errors & warnings in one file, info & debug in another
LOG_COMBINATION=error_warn
```

## Usage

### Importing and Using LogRecorder

```javascript
require("dotenv").config();
const LogRecorder = require("./log-recorder");

const logger = new LogRecorder();

logger.info("Application started successfully");
logger.debug("Debugging mode active");
logger.warn("Low memory warning");
logger.error("Unhandled exception occurred");
```

### Running the sample test script

Sample test script inside `_test_/test.js`:

```javascript
require("dotenv").config();
const LogRecorder = require("../log-recorder");

const logger = new LogRecorder();

console.log("\n--- Logging test started ---\n");

logger.info("Application started successfully");
logger.debug("Debugging mode active");
logger.warn("Low memory warning");
logger.error("Unhandled exception occurred");

console.log("\n--- Logging test completed ---\n");
```

Run sample test script:

```sh
node test
```

## Log File Organization

Depending on the `.env` configuration:

- **All logs in one file:** Set `LOG_COMBINATION=all`, logs are written to `combined.log`.
- **Separate logs for errors/warnings and info/debug:** Set `LOG_COMBINATION=error_warn`, logs are written to `errors.log` and `info_debug.log`.

## License

This project is open-source and available under the MIT license.
