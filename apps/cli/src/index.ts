#!/usr/bin/env node

import fs from "fs";
import path from "path";
import prompts from "prompts";
import { Command } from "commander";
import chalk from "chalk";

// TODO: Customizable through CLI command
// TODO: CLI command to change the notes directory
// TODO: CLI command to show where all notes are present
import { LOGS_DIR } from "./constants";
import FileContentViewer from "./utils/fileContentViewer";
import { getFirstContentLine } from "./utils/getFirstContentLine";

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
	// TODO: create a default template and store in LOGS_DIR/templates
	const template = await prompt(
		"template",
		"Template (e.g., Bug, Learn, Work): "
	);
	const heading = await prompt("heading", "Title: ");
	// TODO: should be able to add multi line content
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
	console.log(chalk.green(`✅ Note saved to ${filepath}`));
}

async function listNotes() {
	// TODO: ADD features of navigation within terminal, show paginated list, can view each log in terminal, and navigate back to list
	const files = fs.readdirSync(LOGS_DIR).filter((f) => f.endsWith(".md"));
	if (files.length === 0) {
		console.log(chalk.yellow("📝 No logs found."));
		return;
	}
	console.log(chalk.blue(`📚 Found ${files.length} notes:\n`));
	files.forEach(async (file, index) => {
		const filepath = path.join(LOGS_DIR, file);
		const content = await fs.promises.readFile(filepath, "utf-8");
		const firstLine = getFirstContentLine(content);
		console.log(chalk.cyan(`${index + 1}. ${file}`));
		console.log(chalk.gray(`   ${firstLine}\n`));
	});
}

async function searchNotes(query: string) {
	// TODO: able to navigate all notes, and add color
	if (!query) {
		query = await prompt("query", "Search Term: ");
		if (!query) {
			process.exit(0);
		}
	}
	const files = fs.readdirSync(LOGS_DIR).filter((f) => f.endsWith(".md"));
	const matchingFiles: string[] = [];

	// All the file checks start at once
	await Promise.all(
		files.map(async (file) => {
			const filepath = path.join(LOGS_DIR, file);
			const data = await fs.promises.readFile(filepath, "utf-8");
			// TODO: match query with title also
			if (data.includes(query)) {
				matchingFiles.push(file);
			}
		})
	);
	if (matchingFiles.length === 0) {
		console.log(
			chalk.yellow(`🔍 No notes found matching "${chalk.bold(query)}"`)
		);
		return;
	}
	console.log(
		chalk.green(
			`🔍 Found ${matchingFiles.length} matching notes for "${chalk.bold(query)}"`
		)
	);
	await FileContentViewer(matchingFiles);
}

const program = new Command();

program
	.name("dev-log")
	.description("A CLI tool for managing development logs")
	.version("1.0.0");

program
	.command("add")
	.description("Add a new development log entry")
	.action(async () => {
		try {
			await addNote();
		} catch (error) {
			console.log(chalk.red("❌ Error adding note: "), error);
			process.exit(1);
		}
	});

program
	.command("list")
	.alias("ls")
	.description("List all dev logs")
	.action(async () => {
		try {
			await listNotes();
		} catch (error) {
			console.log(chalk.red("❌ Error listing notes: "), error);
			process.exit(1);
		}
	});

program
	.command("search")
	.alias("s")
	.description("Search through development logs")
	.argument("[query]", "Search term to look for")
	.action(async (query) => {
		try {
			await searchNotes(query);
		} catch (error) {
			console.error(chalk.red("❌ Error searching notes:"), error);
			process.exit(1);
		}
	});
// TODO: Delete Note
// TODO: Update Note, open using cli, use keyboard event to open in editor
//

// Default action when no command is provided
program.action(() => {
	program.help();
});

program.parse();
