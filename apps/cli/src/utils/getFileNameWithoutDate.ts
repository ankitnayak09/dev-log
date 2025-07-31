export function getFileNameWithoutDate(date: string): string {
	return date.substring(date.indexOf("_") + 1);
}
