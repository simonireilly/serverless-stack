const { promisify } = require("util");
const { exec } = require("child_process");
const yarnInstall = require("./yarn-install");

const execPromise = promisify(exec);
const TIMEOUT = 5000;

async function runAddStackCommand(cwd, stackName) {
  await yarnInstall(cwd);

  let result, error;

  try {
    result = await execPromise(`yarn sst add-stack ${stackName}`, {
      cwd,
      TIMEOUT,
    });
  } catch (e) {
    error = e.toString() + e.stdout;
  }

  return error
    ? error
    : result.stdout.toString("utf8") + result.stderr.toString("utf8");
}

module.exports = runAddStackCommand;
