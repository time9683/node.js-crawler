import * as fs from 'fs';
import * as path from 'path';

const logFileName = 'error.log';
const logFilePath = path.join(__dirname, logFileName);

/**
 * Logs an error message to the console and appends it to a log file.
 *
 * @param error - The error object to be logged. The error message or stack trace will be included in the log.
 */
function logError(error: Error): void {
  const errorMessage = `[${new Date().toISOString()}] ${error.stack || error.message}\n`;
  console.error(errorMessage);
  fs.appendFile(logFilePath, errorMessage, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
}

export default logError;
