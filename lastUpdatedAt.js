import {writeFileSync} from "fs";

(() => {
  const lastUpdatedAt = new Date().toLocaleString();
  console.log("Updating lastUpdatedAt...")
  writeFileSync("./public/lastUpdatedAt.json", JSON.stringify({
    lastUpdatedAt,
  }));
  console.log("Done.")
})();