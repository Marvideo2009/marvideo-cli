#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { dirname } from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { Command } from "commander";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const globalPluginDir = path.join(__dirname, 'plugins');

const program = new Command();

program
  .name("mar")
  .description("CLI pour créer des projets Vite")
  .version("1.0.0");

program
  .command("create")
  .argument("[name]", "Nom du projet", "app")
  .option(
    "-f, --framework <framework>",
    "Choisir le framework (vanilla, vue, react, react-swc, preact, lit, svelte, solid, qwik)",
    "react"
  )
  .option("--ts", "Utiliser TypeScript")
  .option("--tailwind", "Installer Tailwind CSS")
  .action(async (projectName, options) => {
    console.log(options)
    console.log(
      chalk.magentaBright(
        `\n🌟 Création d'un projet avec ${options.framework}`
      )
    );
    const templateMap = {
      "vanilla": options.ts ? "vanilla-ts" : "vanilla",
      "vue": options.ts ? "vue-ts" : "vue",
      "react": options.ts ? "react-ts" : "react",
      "react-swc": options.ts ? "react-swc-ts" : "react-swc",
      "preact": options.ts ? "preact-ts" : "preact",
      "lit": options.ts ? "lit-ts" : "lit",
      "svelte": options.ts ? "svelte-ts" : "svelte",
      "solid": options.ts ? "solid-ts" : "solid",
      "qwik": options.ts ? "qwik-ts" : "qwik",
    };

    const answers = await inquirer.prompt([
        { name: 'description', message: 'Description du projet ?', default: 'Un projet généré avec mar.js' }
    ]);
    const { description } = answers;

    const spinner = ora("Initialisation du projet avec pnpm...").start();


    try {
      const template = templateMap[options.framework];
      if (!template) {
        throw new Error(`Framework ${options.framework} non supporté.`);
      }
      execSync(`pnpm create vite ${projectName} --template ${template}`, {
        stdio: "ignore",
      });
      spinner.succeed("Projet Vite créé");
    } catch (e) {
      spinner.fail("Échec lors de la création du projet");
      console.error(e);
      process.exit(1);
    }

    process.chdir(projectName);

    const spinnerInstall = ora(
      "Installation des dépendances avec pnpm..."
    ).start();

    try {
      execSync("pnpm install", { stdio: "ignore" });
      spinnerInstall.succeed("Dépendances installées");
    } catch (e) {
      spinnerInstall.fail("Erreur lors de l'installation");
      process.exit(1);
    }

    try {
      execSync("pnpm approve-builds", { stdio: "inherit" });
    } catch (e) {
      console.warn(
        chalk.yellow(
          "⚠️ pnpm approve-builds a échoué ou est ignoré. Vérifiez manuellement."
        )
      );
    }
    if (options.tailwind) {
      execSync("pnpm install tailwindcss @tailwindcss/vite", {
        stdio: "ignore",
      });
      const indexCss = `
    @import "tailwindcss";
    @theme {
      --font-display: "Segoe UI", "sans-serif";
      --color-marviolet: #6B21A8;
      --color-marpink: #EC4899;
    }
    `;
      await fs.writeFile("src/index.css", indexCss);
    }
    if (options.framework === "react") {
      const appContent = `export default function App() {
  return (
    <div className=\"min-h-screen flex items-center justify-center bg-gradient-to-br from-marviolet to-marpink text-white\">
      <div className=\"text-center p-8 rounded-2xl bg-white bg-opacity-10 backdrop-blur-md shadow-xl\">
        <h1 className=\"text-5xl font-extrabold mb-4 text-gray-800\">Bienvenue dans ${projectName} 🚀</h1>
        <p className=\"text-lg text-gray-800\">Initialisé avec mar-cli.</p>
      </div>
    </div>
  );
}`;

      await fs.rm("src/App.css", { force: true });
      await fs.writeFile("src/App.tsx", appContent);
    }

    if (options.tailwind && options.framework === "react") {
      await fs.writeFile(
        "vite.config.ts",
        "import { defineConfig } from 'vite'\nimport tailwindcss from '@tailwindcss/vite'\nimport react from '@vitejs/plugin-react'\nexport default defineConfig({\n  plugins: [react(), tailwindcss(),],})"
      );
      execSync(`mar plugin readme-generator "${projectName}" "${description}" React Tailwind TypeScript`, { stdio: "ignore" });
    } else if (options.tailwind) {
      await fs.writeFile(
        "vite.config.ts",
        "import { defineConfig } from 'vite'\nimport tailwindcss from '@tailwindcss/vite'\nexport default defineConfig({\n  plugins: [tailwindcss(),],})"
      );
      execSync(`mar plugin readme-generator "${projectName}" "${description}" Tailwind TypeScript`, { stdio: "ignore" });
    } else {
      await fs.writeFile(
        "vite.config.ts",
        "import { defineConfig } from 'vite'\nexport default defineConfig({\n  plugins: [],})"
      );
      execSync(`mar plugin readme-generator "${projectName}" "${description}" TypeScript`, { stdio: "ignore" });
    }

    execSync(`mar plugin readme-generator "${projectName}" "${description}" ${options.framework === "react" ? "React" : options.framework === "vue" ? "Vue" : options.framework === "svelte" ? "Svelte" : ""}  ${ options.tailwind === true ? "Tailwind" : "" } ${ options.ts === true ? "TypeScript" : "" }`, { stdio: "ignore" });

    execSync("git init", { stdio: "ignore" });

    console.log(chalk.greenBright(`\n✅ Projet ${projectName} prêt !`));
    console.log(chalk.blueBright(`\n➡ cd ${projectName} && pnpm dev`));
  });

program
  .command('plugin <name> [args...]')
  .description('Ajoute un plugin à un projet Marvideoverse')
  .action(async (name, args) => {
    console.log(chalk.cyan(`\n🔌 Installation du plugin : ${name}`));
    try {
      await fs.mkdir(globalPluginDir, { recursive: true });
      const pluginPath = path.join(globalPluginDir, `${name}.js`);
      console.log(chalk.blue(`Chemin du plugin : ${pluginPath}`));

      if (!(await pluginExists(name))) {
        console.log(chalk.red(`❌ Plugin ${name} introuvable.`));
        return;
      }

      const pluginModule = await import(`file://${pluginPath}`);
      await pluginModule.default(args);

      console.log(chalk.greenBright(`✅ Plugin ${name} installé avec succès.`));
    } catch (e) {
      console.error(chalk.red(`Erreur lors de l'installation du plugin ${name} :`), e);
    }
  });

program
  .command('list-plugins')
  .description('Liste les plugins disponibles')
  .action(async () => {
    try {
      await fs.mkdir(globalPluginDir, { recursive: true });
      const files = await fs.readdir(globalPluginDir);
      const plugins = files.filter(f => f.endsWith('.js')).map(f => path.basename(f, '.js'));

      if (plugins.length === 0) {
        console.log(chalk.yellow('Aucun plugin trouvé. Ajoute des plugins dans le dossier `plugins/`.'));
      } else {
        console.log(chalk.green('Plugins disponibles :'));
        plugins.forEach(p => console.log(` - ${p}`));
      }
    } catch (e) {
      console.error(chalk.red('Erreur lors de la lecture des plugins :'), e);
    }
  });

program
  .command('install-plugin <gitUrl>')
  .description('Installe un plugin depuis un dépôt Git (JS)')
  .action(async (gitUrl) => {
    try {
      await fs.mkdir(globalPluginDir, { recursive: true });
      const repoName = gitUrl.split('/').pop().replace(/\.git$/, '');
      const dest = path.join(globalPluginDir, `${repoName}.js`);
      const tmp = path.join(globalPluginDir, '__tmp');

      execSync(`git clone ${gitUrl} ${tmp}`, { stdio: 'ignore' });
      await fs.copyFile(path.join(tmp, 'index.js'), dest);
      execSync(`rm -rf ${tmp}`);

      console.log(chalk.green(`✅ Plugin ${repoName} installé dans plugins/${repoName}.js`));
    } catch (e) {
      console.error(chalk.red('Erreur lors de l\'installation du plugin :'), e);
    }
  });

async function pluginExists(name) {
  try {
    const file = path.join(globalPluginDir, `${name}.js`);
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

program.parse();