import { execSync } from "child_process";

export default function deploy(args) {
  const branch = args[0] || "main";
  const message = args.slice(1).join(" ") || "Déploiement automatique via mar.js";

  try {
    console.log(`🚀 Déploiement en cours sur la branche '${branch}'...`);
    execSync("git add .", { stdio: "inherit" });
    execSync(`git commit -m "${message}"`, { stdio: "inherit" });
    execSync(`git push origin ${branch}`, { stdio: "inherit" });
    console.log("✅ Déploiement terminé avec succès !");
  } catch (err) {
    console.error("❌ Erreur pendant le déploiement :", err.message);
  }
}
