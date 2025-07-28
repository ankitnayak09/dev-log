#!/usr/bin/env node

import fs from "fs";
import path from "path";
import prompts from "prompts";

// TODO: Customizable through CLI command
// TODO: CLI command to change the notes directory
// TODO: CLI command to show where all notes are present
import { LOGS_DIR } from "./constants";
import FileContentViewer from "./utils/fileContentViewer";

// Ensure notes directory exists
if (!fs.existsSync(LOGS_DIR)) {
	fs.mkdirSync(LOGS_DIR, { recursive: true });
}

async function prompt(name: string, message: string): Promise<string> {
	const response = await prompts({
		type: "text",
		name,
		message,
		validate: (value) => value.length > 0,
	});
	return response[name];
}

async function addNote() {
	const date = new Date().toISOString();
	// TODO: Automatic project detection from git repo or folder name
	const project = await prompt("project", "Project name: ");
	const template = await prompt(
		"template",
		"Template (e.g., Bug, Learn, Work): "
	);
	const heading = await prompt("heading", "Title: ");
	const content = await prompt("content", "Note Content: \n");
	const tags = await prompt("tags", "Tags (comma separated): ");

	const filename = `${date.replace(/[:.]/g, "-")}_${heading.replace(/\s+/g, "-")}.md`;
	const filepath = path.join(LOGS_DIR, filename);
	const frontmatter = `
    ---
    date: ${date}
    project: ${project}
    template: ${template}
    tags: [${tags
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean)}]
    ---
    
    ${content}
    `;

	fs.writeFileSync(filepath, frontmatter, "utf-8");
	console.log(`Note saved to ${filepath}`);
}

async function listNotes() {
	// TODO: ADD features of navigation within terminal, show paginated list, can view each log in terminal, and navigate back to list
	const files = fs.readdirSync(LOGS_DIR).filter((f) => f.endsWith(".md"));
	if (files.length === 0) {
		console.log("No logs found.");
		return;
	}
	files.forEach((file) => {
		const filepath = path.join(LOGS_DIR, file);
		const content = fs.readFileSync(filepath, "utf-8");
		const firstLine = content
			.split("\n")
			.find((line) => line && !line.startsWith("---"));
		console.log(`${file}: ${firstLine || " "}`);
	});
}

async function searchNotes() {
	// TODO: able to navigate all notes, and add color
	let query = args[1];
	if (!query) {
		query = await prompt("query", "Search Term: ");
		if (!query) {
			process.exit(1);
		}
	}
	const files = fs.readdirSync(LOGS_DIR).filter((f) => f.endsWith(".md"));
	const matchingFiles: string[] = [];

	// All the file checks start at once
	await Promise.all(
		files.map(async (file) => {
			const filepath = path.join(LOGS_DIR, file);
			const data = await fs.promises.readFile(filepath, "utf-8");
			if (data.includes(query)) {
				matchingFiles.push(file);
			}
		})
	);
	if (matchingFiles.length === 0) {
		console.log("No matching notes found.");
		return;
	}
	FileContentViewer(matchingFiles);
}

async function help() {
	console.log("Help Called");
}
const args = process.argv.slice(2);

async function main() {
	const command = args[0];

	if (!command) {
		help();
		return;
	}

	const functionToCall: Record<string, () => Promise<void>> = {
		add: addNote,
		list: listNotes,
		help: help,
		search: searchNotes,
	};

	if (functionToCall[command]) {
		await functionToCall[command]();
	} else {
		console.log(`Unknown command: ${command}`);
		help();
	}
}

main();
