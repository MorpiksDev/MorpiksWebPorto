import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const headSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="75 60 190 190" width="190" height="190">
  <g id="head" fill="#111111">
    <polygon points="135,97 150,150 87,168" />
    <polygon points="220,111 253,145 159,145" />
    <polygon points="136,159 97,204 104,205 96,205 87,175" />
    <polygon points="165,181 177,202 104,204" />
    <circle cx="128" cy="139.5" r="9.8" fill="#FAFAFA" />
    <circle cx="127.0" cy="139.5" r="4.4" fill="#111111" />
  </g>
</svg>`;

async function run() {
  const svgBuffer = Buffer.from(headSvg);

  // 32x32 icon for app/icon.png
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join("src", "app", "icon.png"));

  // 512x512 icon for app/apple-icon.png
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join("src", "app", "apple-icon.png"));

  // Also write to public/ for direct access / manifest
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join("public", "favicon-32x32.png"));

  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join("public", "favicon-512x512.png"));

  // SVG favicon
  fs.writeFileSync(path.join("public", "favicon.svg"), headSvg);

  console.log("Favicons generated successfully!");
}

run().catch(console.error);
