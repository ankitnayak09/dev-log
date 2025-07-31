import prompts from "prompts";
import fs from "fs";
import path from "path";
import { LOGS_DIR } from "../constants";
import { getFileNameWithoutDate } from "./getFileNameWithoutDate";

export default async function FileContentViewer(matchingFiles: string[]) {
	let keepOpened = true;
	while (keepOpened) {
		const { selectedFile } = await prompts({
			type: "select",
			name: "selectedFile",
			message: "Select a file to view:",
			choices: matchingFiles.map((file) => ({
				title: getFileNameWithoutDate(file),
				value: file,
			})),
			// onCancel: () => {
			// 	console.clear();
			// 	process.exit(0);
			// },
		});
		if (!selectedFile) {
			console.clear();
			process.exit(0);
		}

		const selectedFilePath = path.join(LOGS_DIR, selectedFile);
		const content = fs.readFileSync(selectedFilePath, "utf-8");
		console.clear();
		// console.log(content);
		const lines = content.split("\n");
		const pageSize = process.stdout.rows - 2; // Leave space for prompt
		let start = 0;

		function printPage() {
			console.clear();
			for (
				let i = start;
				i < Math.min(start + pageSize, lines.length);
				i++
			) {
				console.log(lines[i]);
			}
			console.log("\nUse ↑/↓ to scroll, ESC to return.");
		}

		printPage();

		// Wait for Escape Key
		await new Promise<void>((resolve) => {
			process.stdin.setRawMode(true);
			process.stdin.resume();
			process.stdin.on("data", onKey);

			function onKey(data: Buffer) {
				const key = data.toString();
				if (key === "\u001b") {
					// ESC
					cleanup();
					console.clear();
					resolve();
				} else if (key === "\u001b[A") {
					// Up arrow
					if (start > 0) start--;
					printPage();
				} else if (key === "\u001b[B") {
					// Down arrow
					if (start + pageSize < lines.length) start++;
					printPage();
				}
			}

			function cleanup() {
				process.stdin.setRawMode(false);
				process.stdin.pause();
				process.stdin.removeListener("data", onKey);
			}
		});
	}
	console.clear();
}
