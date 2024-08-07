const fs = require("fs");
const configLoader = require("../utils/configLoader");
const AndroidManifestProcessor = require("../processors/android/manifestProcessor");
const AndroidBuildGradleProcessor = require("../processors/android/buildGradleProcessor");
const AndroidClassicIconProcessor = require("../processors/android/classicIconProcessor");
const AndroidClassicRoundedIconProcessor = require("../processors/android/classicRoundedIconProcessor");
const AndroidAdaptiveIconProcessor = require("../processors/android/adaptiveIconProcessor");
const IosIconProcessor = require("../processors/ios/iconProcessor");
const IosLaunchScreenProcessor = require("../processors/ios/launchScreenProcessor");
const IosSchemasProcessor = require("../processors/ios/schemasProcessor");
const IosBuildTargetsProcessor = require("../processors/ios/buildTargetsProcessor");
const IosXcConfigProcessor = require("../processors/ios/xcConfigProcessor");

async function applyInstructions(configFilePath) {
  const config = configLoader(configFilePath);
  for (const instruction of config.instructions) {
    // apply the instruction
    switch (instruction) {
      case "assets:download":
        // console.log("Downloading assets...");
        break;
      case "assets:extract":
        // console.log("Extracting assets...");
        break;
      case "android:androidManifest":
        try {
          console.log("Updating AndroidManifest...");
          const androidManifest = fs.readFileSync(
            `${process.cwd()}/android/app/src/main/AndroidManifest.xml`,
            "utf8"
          );
          const updatedAndroidMAnifest = await AndroidManifestProcessor(
            androidManifest,
            config
          );
          fs.writeFileSync(
            `${process.cwd()}/android/app/src/main/AndroidManifest.xml`,
            updatedAndroidMAnifest
          );
          console.log(`✅ AndroidManifest updated!\n`);
        } catch (error) {
          console.error("❌ Error updating AndroidManifest:", error, "\n");
        }
        break;
      case "android:buildGradle":
        try {
          console.log("Updating build.gradle...");
          const buildGradle = fs.readFileSync(
            `${process.cwd()}/android/app/build.gradle`,
            "utf8"
          );
          const upadtedBuildGradle = await AndroidBuildGradleProcessor(
            buildGradle,
            config
          );
          fs.writeFileSync(
            `${process.cwd()}/android/app/build.gradle`,
            upadtedBuildGradle
          );
          console.log(`✅ build.gradle updated!\n`);
        } catch (error) {
          console.error("❌ Error updating build.gradle:", error, "\n");
        }
        break;
      case "android:dummyAssets":
        // console.log("Adding dummy assets...");
        break;
      case "android:icons":
        try {
          console.log("Updating android icons...");
          await AndroidClassicIconProcessor(config);
          console.log(`✅ Android classic icons updated!`);
          await AndroidClassicRoundedIconProcessor(config);
          console.log(`✅ Android rounded icons updated!`);
          await AndroidAdaptiveIconProcessor(config);
          console.log(`✅ Android adaptive icons updated!\n`);
        } catch (error) {
          console.error("❌ Error updating android icons:", error, "\n");
        }
        break;
      case "reactnative:flavors":
        // console.log("Updating flavors...");
        break;
      case "reactnative:app":
        // console.log("Updating app...");
        break;
      case "reactnative:pages":
        // console.log("Updating pages...");
        break;
      case "reactnative:main":
        // console.log("Updating main...");
        break;
      case "reactnative:targets":
        // console.log("Updating targets...");
        break;
      case "ios:xcconfig":
        try {
          console.log("Updating xcconfig...");
          await IosXcConfigProcessor(config);
          console.log(`✅ XcConfig updated!\n`);
        } catch (error) {
          console.error("❌ Error updating xcconfig:", error, "\n");
        }
        break;
      case "ios:buildTargets":
        try {
          console.log("Updating buildTargets...");
          await IosBuildTargetsProcessor(config);
          console.log(`✅ BuildTargets updated!\n`);
        } catch (error) {
          console.error("❌ Error updating buildTargets:", error, "\n");
        }
        break;
      case "ios:schema":
        try {
          console.log("Updating schemas...");
          await IosSchemasProcessor(config);
          console.log(`✅ Schemas updated!\n`);
        } catch (error) {
          console.error("❌ Error updating schemas:", error, "\n");
        }
        break;
      case "ios:dummyAssets":
        // console.log("Adding dummy assets...");
        break;
      case "ios:icons":
        try {
          console.log("Updating iOS icons...");
          await IosIconProcessor(config);
          console.log(`✅ iOS icons updated!\n`);
        } catch (error) {
          console.error("❌ Error updating iOS icons:", error, "\n");
        }
        break;
      case "ios:plist":
        // console.log("Updating plist...");
        break;
      case "ios:launchScreen":
        try {
          console.log("Updating launchScreen...");
          await IosLaunchScreenProcessor(config);
          console.log(`✅ LaunchScreen updated!\n`);
        } catch (error) {
          console.error("❌ Error updating launchScreen:", error, "\n");
        }
        break;
      case "google:firebase":
        // console.log("Updating firebase...");
        break;
      case "assets:clean":
        // console.log("Cleaning assets...");
        break;
      case "ide:config":
        // console.log("Updating ide config...");
        break;
    }
  }
}

module.exports = {
  applyInstructions,
};
