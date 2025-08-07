import path from "path";
import os from "os";

export const LOGS_DIR = path.join(os.homedir(), "dev-logs");
export const TEST_LOGS_DIR = path.join(os.homedir(), "dev-logs", "test-data");
