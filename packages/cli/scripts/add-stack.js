"use strict";

// Given an existing serverless stack project, detect the lib/infra
// folder and add the new stack to that folder

// This will increase the speed of building multi-stack applications, whilst
// also showing (tell don't ask) how to configure multiple stacks

const chalk = require("chalk");
const camelCase = require("camelcase");
const { logger } = require("@serverless-stack/core");
const path = require("path");
const fs = require("fs");

const TEMPLATE_EXTENSION_LOOKUP = {
  ".ts": "typescript",
  ".js": "default",
};

module.exports = async function (argv, config) {
  const { stackName } = argv;

  // Must have a string name for the stack
  if (typeof stackName !== "string") {
    logger.info(chalk.red(`Supply a stack name 'sst add-stack [stack-name]'`));
    process.exit(1);
  }

  const { ext, dir } = path.parse(config.main);

  // The file should have an extension in the lookup
  if (!ext || !TEMPLATE_EXTENSION_LOOKUP[ext]) {
    logger.info(chalk.red(`Entry-point main '${config.main}' is invalid`));
    process.exit(1);
  }

  const templatePath = path.join(
    __dirname,
    `../templates/${TEMPLATE_EXTENSION_LOOKUP[ext]}/%stack-name.PascalCased%.template${ext}`
  );

  const pascalCaseStackName = camelCase(stackName, { pascalCase: true });

  const template = fs.readFileSync(templatePath, { encoding: "utf-8" });
  const newStackFile = template.replace(
    /%stack-name.PascalCased%/g,
    pascalCaseStackName
  );
  const newStackFileName = `${pascalCaseStackName}${ext}`;
  const newStackFileLocation = path.join(process.cwd(), dir, newStackFileName);
  logger.info(chalk.cyan(`Adding new stack ${newStackFileLocation}`));

  // Create app directory
  if (!fs.existsSync(newStackFileLocation)) {
    fs.writeFileSync(newStackFileLocation, newStackFile);
  } else {
    logger.error(
      chalk.red(`A file called ${newStackFileLocation} already exists.`)
    );
    process.exit(1);
  }

  logger.info(
    chalk.cyan(`Stack created, import it in ${config.main} to deploy`)
  );
  logger.info(
    chalk.cyan(`import ${newStackFileName} from './${newStackFileName}`)
  );
};
