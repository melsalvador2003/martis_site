import fs from "fs";
import path from "path";

function findArchives(dir) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file === "node_modules" || file === ".next" || file === ".git" || file === "dist") continue;
      const fullPath = path.join(dir, file);
      let stat;
      try {
        stat = fs.statSync(fullPath);
      } catch (e) {
        continue;
      }
      if (stat.isDirectory()) {
        findArchives(fullPath);
      } else if (file.endsWith(".zip") || file.endsWith(".tar") || file.endsWith(".gz")) {
        console.log("Found archive:", fullPath);
      }
    }
  } catch (e) {
    // Ignore error
  }
}

console.log("Searching for archives...");
findArchives("/app");
findArchives("/tmp");
console.log("Search complete.");
