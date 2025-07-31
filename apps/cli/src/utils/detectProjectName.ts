import { execSync } from "child_process";

export function detectProjectName(): string {
	try {
		const gitRepo = execSync("git remote get-url origin", {
			encoding: "utf-8",
			stdio: ["pipe", "pipe", "ignore"],
		}).trim();

		const repoName = gitRepo.split("/").pop()?.replace(".git", "") || "";
		if (repoName) return repoName;
	} catch (error) {
		// Git command failed, fall back to folder name
	}

	const currentDir = process.cwd().split("/").pop() || "";
	return currentDir;
}
