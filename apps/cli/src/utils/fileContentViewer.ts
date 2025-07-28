import prompts from "prompts";
import fs from "fs";
import path from "path";
import { LOGS_DIR } from "../constants";

export default async function FileContentViewer(matchingFiles: string[]) {
	let keepOpened = true;
	while (keepOpened) {
		const { selectedFile } = await prompts({
			type: "select",
			name: "selectedFile",
			message: "Select a file to view:",
			choices: matchingFiles.map((file) => ({
				title: file,
				value: file,
			})),
		});
		if (!selectedFile) break;

		const selectedFilePath = path.join(LOGS_DIR, selectedFile);
		const content = fs.readFileSync(selectedFilePath, "utf-8");
		console.clear();
		console.log(content);
		console.log("\nPress ESC to return to the list.");

		// Wait for Escape Key
		await new Promise((resolve) => {
			process.stdin.setRawMode(true);
			process.stdin.resume();
			process.stdin.once("data", (data) => {
				if (data.toString() === "\u001b") {
					process.stdin.setRawMode(false);
					process.stdin.pause();
					resolve(null);
				}
			});
		});
	}
	console.clear();
}
