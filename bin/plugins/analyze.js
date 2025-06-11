import fs from "fs";
import path from "path";

function countLines(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  return content.split(/\r\n|\r|\n/).length;
}

function walk(dir, extList, files = []) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const relativePath = path.relative(process.cwd(), fullPath);

    if (relativePath.includes("node_modules")) return;

    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, extList, files);
    } else if (extList.includes(path.extname(fullPath))) {
      files.push(fullPath);
    }
  });
  return files;
}

export default function analyze(args) {
  const cwd = process.cwd();
  const extensions = [".js", ".ts", ".jsx", ".tsx", ".md", ".html", ".css", ".scss", ".vue", ".json", ".yml", ".txt"];
  const files = walk(cwd, extensions);

  if (files.length === 0) {
    console.log("Aucun fichier source trouvé.");
    return;
  }

  let totalLines = 0;
  console.log("📦 Analyse des fichiers :\n");

  for (const file of files) {
    const lineCount = countLines(file);
    totalLines += lineCount;
    console.log(`- ${path.relative(cwd, file)} : ${lineCount} lignes`);
  }

  console.log(`\n✅ Total : ${totalLines} lignes dans ${files.length} fichiers.`);
}