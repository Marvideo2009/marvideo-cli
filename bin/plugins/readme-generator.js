import fs from "fs";

export default function readmeGenerator(args) {
  const [name, description, ...technos] = args;

  if (!name || !description) {
    console.log("❌ Utilisation : mar plugin readme-generator Nom \"Description\" [Techno1 Techno2 ...]");
    return;
  }

  const content = 
`# 🌌 ${name}

> Un projet généré avec [**mar.js**](https://github.com/Marvideo2009) — le starter officiel de **Marvideo** pour des projets rapides, stylés et modulaires.

---

## 🚀 Description

${description}

## 🔧 Technologies utilisées

${technos.map(t => `- ${t}`).join("\n")}

## 🚀 Lancer le projet

\`\`\`bash
pnpm install
pnpm dev
\`\`\`
`;

  fs.writeFileSync("README.md", content);
  console.log("✅ README.md généré avec succès !");
}