export function getFirstContentLine(content: string): string {
	const lines = content.split("\n");
	let inFrontMatter = false;

	for (const line of lines) {
		const trimmedLine = line.trim();

		if (trimmedLine === "---") {
			inFrontMatter = !inFrontMatter;
			continue;
		}

		// Skip empty lines and frontmatter
		if (!trimmedLine || inFrontMatter) {
			continue;
		}

		return trimmedLine;
	}

	return "No content";
}
