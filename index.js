#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const rimrafSync = require("rimraf").sync;
const spawn = require('child_process').spawn;

function fileExistsSync(filePath) {
  try {
    const stat = fs.statSync(filePath);
    return true;
  } catch (err) {
    if (err.code === "ENOENT") {
      return false;
    } else {
      throw err;
    }
  }
}

// check if I'm inside of a npm package folder
if (!fileExistsSync(path.join(process.cwd(), "package.json"))) {
  console.log("I'm not inside of an npm package dir, exiting...");
  process.exit();
}

// confirm
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})

console.log("This command will remove './node_modules' and 'package-lock.json', and run 'npm install'.");
process.stdout.write("Sure about this? (Y/n)");

rl.on('line', function (cmd) {
  if (cmd.toLowerCase() === "n") {
    process.exit();
  } else {
    // delete node_modules
    console.log("Removing 'node_modules'...");
    rimrafSync("./node_modules");

    // delete package-lock.json
    console.log("Deleting 'package-lock.json'");
    rimrafSync("package-lock.json");

    // run npm install
    console.log("Running 'npm install'");
    const npmInstallSpawn = spawn("npm", ["install"], {
      stdio: "inherit",
      shell: true
    }).on("close", function () {
      process.exit();;
    });
  }
});
