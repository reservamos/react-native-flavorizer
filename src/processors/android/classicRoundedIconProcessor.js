const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function AndroidClassicRoundedIconProcessor(config) {
  const sizes = {
    "mipmap-mdpi": [48, 48],
    "mipmap-hdpi": [72, 72],
    "mipmap-xhdpi": [96, 96],
    "mipmap-xxhdpi": [144, 144],
    "mipmap-xxxhdpi": [192, 192],
  };

  if (!config) {
    throw new Error("NoConfigurationFileException");
  }

  config.flavors.forEach((flavor) => {
    const { flavorName, defaultIcon } = flavor;

    if (!fs.existsSync(defaultIcon)) {
      throw new Error(
        `Icon file ${defaultIcon} for ${flavorName} flavor does not exist`
      );
    }

    const iconBuffer = fs.readFileSync(defaultIcon);

    Object.keys(sizes).forEach((size) => {
      const [width, height] = sizes[size];
      const iconPath = `${process.cwd()}/android/app/src/${flavorName}/res/${size}/ic_launcher_round.png`;
      const icon = path.resolve(iconPath);
      const iconExists = fs.existsSync(icon);

      if (iconExists) {
        fs.rmSync(icon);
      } else {
        fs.mkdirSync(path.dirname(icon), { recursive: true });
      }

      const halfWidth = width / 2;
      const roundedIconOvelay = Buffer.from(
        `<svg width="${width}" height="${height}"><circle cx="${halfWidth}" cy="${halfWidth}" r="${halfWidth}" fill="black"/></svg>`
      );

      sharp(iconBuffer)
        .resize(width, height)
        .composite([
          {
            input: roundedIconOvelay,
            blend: "dest-in",
          },
        ])
        .toFile(icon, (err) => {
          if (err) {
            throw new Error(err);
          }
        });
    });
  });
}

module.exports = AndroidClassicRoundedIconProcessor;
