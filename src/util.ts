export const NEW_LINE = "\n";

/**
 * Filter out the falsy values and join the truthy (string) values together.
 */
export function insert(...values: (string | null | undefined | false)[]) {
	let results = "";

	for (const value of values) {
		if (typeof value === "string") {
			results += value;
		}
	}

	return results;
}
