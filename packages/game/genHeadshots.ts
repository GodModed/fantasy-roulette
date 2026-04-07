const fs = require("fs");
const path = require("path");

const dir = path.join(process.cwd(), "assets/headshots");

const files = fs.readdirSync(dir);

const entries = files.map((file: any) => {
  const id = path.parse(file).name;
  return `\t"${id}": require("@/assets/headshots/${file}")`;
});

const output = `export const HEADSHOTS: Record<string, any> = {\n${entries.join(",\n")}\n};\n`;

fs.writeFileSync(path.join(process.cwd(), "headshots.ts"), output);