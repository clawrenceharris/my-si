// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execSync } = require("child_process");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

const TYPES_DIR = path.resolve(__dirname, "../src/types");
const DB_TYPES_FILE = path.join(TYPES_DIR, "database.ts");
const TABLES_FILE = path.join(TYPES_DIR, "tables.ts");
const PROJECT_ID = "zdbqltzqdvjpvppuibdw";

// 1. Run Supabase codegen
execSync(
  `supabase gen types typescript --project-id ${PROJECT_ID} --schema public > ${DB_TYPES_FILE}`,
  { stdio: "inherit" }
);

// 2. Read database.ts text
const fileContents = fs.readFileSync(DB_TYPES_FILE, "utf-8");

// 3. Extract table names (look for "<tableName>: { Row:")
const tableRegex = /^(\s*)(\w+):\s*{\s*Row:/gm;
const tableNames = [];
let match;

while ((match = tableRegex.exec(fileContents)) !== null) {
  tableNames.push(match[2]);
}

if (tableNames.length === 0) {
  throw new Error(
    "Could not find any tables in database.ts — check that Supabase generated correctly."
  );
}

// 4. Generate tables.ts file
let output = `// Auto-generated. Do not edit.
import { Database } from "./database";

`;

for (const table of tableNames) {
  const pascalName = table
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

  output += `export type ${pascalName} = Database["public"]["Tables"]["${table}"]["Row"];\n`;
  output += `export type ${pascalName}Insert = Database["public"]["Tables"]["${table}"]["Insert"];\n`;
  output += `export type ${pascalName}Update = Database["public"]["Tables"]["${table}"]["Update"];\n\n`;
}

fs.writeFileSync(TABLES_FILE, output, "utf-8");
console.log(`Wrote ${TABLES_FILE}`);
