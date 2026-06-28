import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const ROOT = process.cwd();
const inputPath = resolve(ROOT, "index.html");
const outputDir = resolve(ROOT, "dist");
const outputPath = resolve(
  outputDir,
  "Aleksandr_Kudriavtcev_Software_Developer_CV.pdf"
);

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(`file://${inputPath}`, { waitUntil: "networkidle" });
await page.emulateMedia({ media: "print" });

await page.pdf({
  path: outputPath,
  preferCSSPageSize: true,
  printBackground: true,
  scale: 0.98,
  margin: {
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
  },
});

await browser.close();
console.log(`PDF generated: ${outputPath}`);
