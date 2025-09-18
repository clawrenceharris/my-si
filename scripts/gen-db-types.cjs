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

//Run Supabase codegen
execSync(
  `supabase gen types typescript --project-id ${PROJECT_ID} --schema public > ${DB_TYPES_FILE}`,
  { stdio: "inherit" }
);

//Read database.ts text
const fileContents = fs.readFileSync(DB_TYPES_FILE, "utf-8");

//Extracts table names (looks for "<tableName>: { Row:")
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

//Extracts enum names (looks for "Enums: { <enumName>:")
const enumRegex = /^\s*(\w+):\s*\([\s\S]*?\)/gm;
const enumBlockMatch = fileContents.match(/Enums:\s*{([^}]*)}/m);
const enumNames = [];

if (enumBlockMatch) {
  let enumMatch;
  while ((enumMatch = enumRegex.exec(enumBlockMatch[1])) !== null) {
    enumNames.push(enumMatch[1]);
  }
}

//Generate tables.ts file
let output = `// Auto-generated. Do not edit.
import { Database } from "./database";

`;

// Tables
for (const table of tableNames) {
  const pascalName = table
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

  output += `export type ${pascalName} = Database["public"]["Tables"]["${table}"]["Row"];\n`;
  output += `export type ${pascalName}Insert = Database["public"]["Tables"]["${table}"]["Insert"];\n`;
  output += `export type ${pascalName}Update = Database["public"]["Tables"]["${table}"]["Update"];\n\n`;
}

// Enums
for (const enumName of enumNames) {
  const pascalName = enumName
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

  output += `export type ${pascalName}Enum = Database["public"]["Enums"]["${enumName}"];\n`;
}

fs.writeFileSync(TABLES_FILE, output, "utf-8");
console.log(
  `Wrote ${TABLES_FILE} with ${tableNames.length} tables and ${enumNames.length} enums`
);
