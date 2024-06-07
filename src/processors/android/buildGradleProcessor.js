const snakeize = require("snakeize");
const { wrappedValue } = require("../../utils/stringUtils");

const androidEntryPoint = "android {";
const beginFlavorDimensionsMarkup =
  "// ----- BEGIN flavorDimensions (autogenerated by react-native-flavorizer) -----";
const endFlavorDimensionsMarkup =
  "// ----- END flavorDimensions (autogenerated by react-native-flavorizer) -----";

function AndroidBuildGradleProcessor(input, config) {
  const flavorDimensions = "flavorDimensions";

  const androidPosition = input.indexOf(androidEntryPoint);
  const existingFlavorDimensions = input.includes(flavorDimensions);
  const beginFlavorDimensionsMarkupPosition = input.indexOf(
    beginFlavorDimensionsMarkup
  );
  const endFlavorDimensionsMarkupPosition = input.indexOf(
    endFlavorDimensionsMarkup
  );

  if (androidPosition < 0) {
    throw new Error("MalformedResourceException");
  }

  if (
    existingFlavorDimensions &&
    (beginFlavorDimensionsMarkupPosition < 0 ||
      endFlavorDimensionsMarkupPosition < 0)
  ) {
    throw new Error("ExistingFlavorDimensionsException");
  }

  const buffer = [];

  const cleanedInput = cleanupFlavors(
    input,
    beginFlavorDimensionsMarkupPosition,
    endFlavorDimensionsMarkupPosition
  );

  if (cleanedInput) {
    input = cleanedInput;
  }

  appendStartContent(buffer, androidPosition, input);
  appendFlavorsDimension(buffer, config);
  appendFlavors(buffer, config);
  appendEndContent(buffer, androidPosition, input);

  return buffer.join("");
}

function cleanupFlavors(
  input,
  beginFlavorDimensionsMarkupPosition,
  endFlavorDimensionsMarkupPosition
) {
  if (
    beginFlavorDimensionsMarkupPosition >= 0 &&
    endFlavorDimensionsMarkupPosition >= 0
  ) {
    const flavorDimensions = input.substring(
      beginFlavorDimensionsMarkupPosition - 2,
      endFlavorDimensionsMarkupPosition + endFlavorDimensionsMarkup.length + 4
    );

    input = input.replaceAll(flavorDimensions, "");
    return input;
  }
}

function appendStartContent(buffer, androidPosition, input) {
  buffer.push(input.substring(0, androidPosition + androidEntryPoint.length));
}

function appendFlavorsDimension(buffer, config) {
  const flavorDimension =
    config.app.android.flavorDimensions || "flavorDimensions";

  buffer.push("");
  buffer.push(`    ${beginFlavorDimensionsMarkup}`);
  buffer.push(`    flavorDimensions += "${flavorDimension}"`);
  buffer.push("");
}

function appendFlavors(buffer, config) {
  const flavorDimension =
    config.app.android.flavorDimensions || "flavorDimensions";

  buffer.push("    productFlavors {");

  config.flavors.forEach((flavor) => {
    buffer.push(`        ${flavor.flavorName} {`);
    buffer.push(`            dimension "${flavorDimension}"`);
    buffer.push(`            applicationId "${flavor.android.applicationId}"`);

    // flavor.android.customConfig.forEach((key, value) => {
    //   buffer.push(`            ${key} ${value}`);
    // });

    const resValues = {
      appName: {
        type: "string",
        value: flavor.appName,
      },
      ...config.app.android.resValues,
      ...flavor.android.resValues,
    };

    Object.entries(snakeize(resValues)).forEach(([key, res]) => {
      buffer.push(
        `            resValue "${res.type}", "${key}", "${res.value}"`
      );
    });

    const buildConfigFields = {
      ...config.app.android.buildConfigFields,
      ...flavor.android.buildConfigFields,
    };

    Object.entries(snakeize(buildConfigFields)).forEach(([key, res]) => {
      buffer.push(
        `            buildConfigField "${res.type}", "${key}", ${wrappedValue(
          res.type,
          res.value
        )}`
      );
    });

    buffer.push("        }");
  });

  buffer.push("    }");
  buffer.push("");
}

function appendEndContent(buffer, androidPosition, input) {
  buffer.push(`    ${endFlavorDimensionsMarkup}`);
  buffer.push(input.substring(androidPosition + androidEntryPoint.length + 1));
}

module.exports = AndroidBuildGradleProcessor;
