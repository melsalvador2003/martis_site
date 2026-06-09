import fs from "fs";
import path from "path";

const found = [];
function searchSystem(dir) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      let stat;
      try {
        stat = fs.statSync(fullPath);
      } catch (e) {
        continue;
      }
      if (stat.isDirectory()) {
        if (found.length < 10) {
          // avoid searching deep recursively into binary/system folders unless necessary
          if (["/proc", "/sys", "/dev", "/node_modules", "/lib", "/var/lib/docker"].some(p => fullPath.startsWith(p))) continue;
          searchSystem(fullPath);
        }
      } else if (file === "logo_noturno.svg") {
        console.log("Found logo_noturno.svg:", fullPath);
        found.push(fullPath);
      }
    }
  } catch (e) {}
}

console.log("Searching root for logo_noturno.svg...");
searchSystem("/");
console.log("Done.");
