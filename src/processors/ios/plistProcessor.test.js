const fs = require("fs");
const configLoader = require("../../utils/configLoader");
const IosPlistProcessor = require("./plistProcessor");
const constants = require("../../utils/constants");
const configFilePath = `${process.cwd()}/testResources/${
  constants.CONFIG_FILE
}`;
const config = configLoader(configFilePath);
const stripEndOfLines = require("../../utils/testUtils");
const { platform } = require("os");

describe("IosPlistProcessor", () => {
  if (platform() === "darwin") {
    const plistPath = `${process.cwd()}/testResources/ios/plistProcessorTest/Info.plist`;

    const matcher = fs.readFileSync(
      `${process.cwd()}/testResources/ios/plistProcessorTest/Matcher.plist`,
      "utf8"
    );

    it("Test IosPlistProcessor", async () => {
      const result = await IosPlistProcessor(plistPath, config);
      expect(stripEndOfLines(result)).toEqual(stripEndOfLines(matcher));
    });
  } else {
    it("Test IosPlistProcessor", async () => {
      expect().toBeUndefined();
    });
  }
});

describe("IosPlistProcessor", () => {
  if (platform() === "darwin") {
    const plistPath = `${process.cwd()}/testResources/ios/plistProcessorTest/Malformed.plist`;

    describe("IosPlistProcessor", () => {
      it("Test malformed IosPlistProcessor", async () => {
        await expect(IosPlistProcessor(plistPath, config)).rejects.toThrow();
      });
    });
  } else {
    it("Test IosPlistProcessor", async () => {
      expect().toBeUndefined();
    });
  }
});
