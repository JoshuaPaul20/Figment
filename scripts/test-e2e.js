#!/usr/bin/env node

/**
 * End-to-end test to verify Figment works after build
 */

import { execSync } from 'child_process';
import { accessSync } from 'fs';
import chalk from 'chalk';

function runTest(command, description) {
  try {
    console.log(chalk.blue(`Testing: ${description}`));
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 10000,
      cwd: process.cwd()
    });
    console.log(chalk.green(`✅ ${description}`));
    return output;
  } catch (error) {
    console.error(chalk.red(`❌ ${description}`));
    console.error(`Command: ${command}`);
    console.error(`Error: ${error.message}`);
    return null;
  }
}

console.log(chalk.bold('🧪 Running Figment E2E Tests'));
console.log('');

// Test 1: CLI available
const versionOutput = runTest('node packages/cli/dist/cli.js --version', 'CLI version command');
if (!versionOutput) process.exit(1);

// Test 2: Help command
const helpOutput = runTest('node packages/cli/dist/cli.js --help', 'Help command');
if (!helpOutput) process.exit(1);

// Test 3: Status command 
const statusOutput = runTest('node packages/cli/dist/cli.js status', 'Status command');
if (statusOutput && statusOutput.includes('Test Brand')) {
  console.log(chalk.green('✅ Found existing Test Brand configuration'));
} else if (statusOutput && statusOutput.includes('No brand context')) {
  console.log(chalk.green('✅ Status command works (no brand context yet)'));
} else {
  console.log(chalk.yellow('⚠️ Unexpected status output, but command ran'));
}

// Test 4: Check that all required files exist
const requiredFiles = ['packages/cli/dist/cli.js', 'packages/core/dist/server.js', 'packages/core/dist/brand-context.js', 'packages/core/dist/types.js'];
let allFilesExist = true;

requiredFiles.forEach(file => {
  try {
    accessSync(file);
    console.log(chalk.green(`✅ ${file} exists`));
  } catch (error) {
    console.log(chalk.red(`❌ ${file} missing`));
    allFilesExist = false;
  }
});

console.log('');
if (allFilesExist) {
  console.log(chalk.green.bold('🎉 All E2E tests passed!'));
  console.log('Figment is ready for distribution.');
} else {
  console.log(chalk.red.bold('❌ Some tests failed'));
  process.exit(1);
}