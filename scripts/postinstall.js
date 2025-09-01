#!/usr/bin/env node

import { execSync } from 'child_process';
import chalk from 'chalk';

console.log(chalk.blue.bold('🎨 Figment Installation Complete!'));
console.log('');

// Test if figment command works
try {
  execSync('figment --version', { stdio: 'pipe' });
  console.log(chalk.green('✅ figment command is available globally'));
  console.log('');
  console.log('Get started:');
  console.log(chalk.cyan('  figment init     # Set up your brand guide'));
  console.log(chalk.cyan('  figment status   # Check configuration'));
  console.log(chalk.cyan('  figment --help   # See all commands'));
} catch (error) {
  console.log(chalk.yellow('⚠️  Global command setup'));
  console.log('If "figment" command is not found, try:');
  console.log(chalk.cyan('  npx @figmentdev/figment --help'));
  console.log('');
  console.log('Or add npm global bin to your PATH:');
  if (process.platform === 'win32') {
    console.log('Windows: Add to PATH: %APPDATA%\\npm');
  } else {
    console.log('Unix: Add to PATH: ~/.npm/bin or /usr/local/bin');
  }
}

console.log('');
console.log('📖 Documentation: https://github.com/figmentdev/figment');
console.log('🐛 Issues: https://github.com/figmentdev/figment/issues');