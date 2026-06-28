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

const pageHeightPx = await page.$eval(".page", (el) =>
  Math.ceil(el.getBoundingClientRect().height)
);
const a4HeightPx = 1122.52; // A4 height at 96 DPI
const fitScale = Math.min(1, (a4HeightPx / pageHeightPx) * 0.995);
const scale = Math.max(0.85, fitScale);

await page.pdf({
  path: outputPath,
  preferCSSPageSize: true,
  printBackground: true,
  scale,
  margin: {
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
  },
});

await browser.close();
console.log(`Rendered content height: ${pageHeightPx}px`);
console.log(`PDF scale used: ${scale.toFixed(4)}`);
console.log(`PDF generated: ${outputPath}`);
