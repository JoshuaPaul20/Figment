
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs/promises';
import path from 'path';
import os from 'os'; // Added os import

// Import from sdk package
import { BrandContextManager } from '@figmentdev/sdk/brand-context';
import type { BrandContext } from '@figmentdev/sdk/types';

const program = new Command();

program
  .name('figment')
  .description('Brand-aware AI code generation CLI')
  .version('0.1.0');

// Add setup command for web interface
program
  .command('setup')
  .description('Launch visual brand guide setup')
  .option('--web', 'Open web interface for visual setup')
  .action(async (options) => {
    if (options.web) {
      console.log(chalk.blue.bold('🎨 Starting Figment Web Interface...'));
      console.log('Opening your browser at http://localhost:3456');

      try {
        // Import and start the web server
        const { spawn } = await import('child_process');
        const webServer = spawn('npm', ['run', 'dev', '--workspace=packages/web'], {
          stdio: 'pipe',
          shell: true,
        });

        // Wait a moment for server to start
        setTimeout(() => {
          import('open').then(module => module.default('http://localhost:3456'));
        }, 3000);

        console.log('Web interface running at http://localhost:3456');
        console.log('Press Ctrl+C to stop the server');

        // Pipe output
        webServer.stdout?.on('data', (data) => {
          console.log(data.toString());
        });

        webServer.stderr?.on('data', (data) => {
          console.error(data.toString());
        });

      } catch (error) {
        console.error(chalk.red('Failed to start web interface:'), error);
        console.log(chalk.yellow('Alternative: Run manually with:'));
        console.log(chalk.cyan('npm run dev --workspace=packages/web'));
      }
    } else {
      console.log(chalk.yellow('Use --web flag to open visual interface'));
      console.log(chalk.cyan('figment setup --web'));
    }
  });

// Initialize brand guide
program
  .command('init')
  .description('Initialize your brand guide interactively')
  .option('--quick', 'Quick setup with minimal prompts')
  .action(async (options) => {
    console.log(`
  ███████╗██╗ ██████╗ ███╗   ███╗███████╗███╗   ██╗████████╗
  ██╔════╝██║██╔════╝ ████╗ ████║██╔════╝████╗  ██║╚══██╔══╝
  █████╗  ██║██║  ███╗██╔████╔██║█████╗  ██╔██╗ ██║   ██║
  ██╔══╝  ██║██║   ██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║
  ██║     ██║╚██████╔╝██║ ╚═╝ ██║███████╗██║ ╚████║   ██║
  ╚═╝     ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝
`);
    console.log(chalk.blue.bold('🎨 Welcome to Figment!'));
    console.log("Let's set up your brand guide for AI-powered code generation.\\n");

    const brandManager = new BrandContextManager();

    try {
      const brandContext = await collectBrandInfo(options.quick);

      const spinner = ora('Saving brand context...').start();
      await brandManager.saveContext(brandContext);
      spinner.succeed('Brand context saved!');

      console.log(chalk.green('\\n✅ Setup complete!'));
      console.log('\\nNext steps:');
      console.log('1. Configure your MCP client (Claude Desktop, Cursor, etc.)');
      console.log('2. Start coding with AI - your components will now follow your brand guidelines!');
      console.log('\\nRun `figment status` to verify everything is working.');

    } catch (error) {
      console.error(chalk.red('Failed to initialize brand guide:'), error);
      process.exit(1);
    }
  });

// Import existing brand guide
program
  .command('import <file>')
  .description('Import brand guide from markdown, PDF, or design tokens')
  .action(async (file) => {
    const spinner = ora(`Importing brand guide from ${file}...`).start();

    try {
      const brandManager = new BrandContextManager();

      if (file.endsWith('.md')) {
        const partialContext = await brandManager.parseBrandGuideMarkdown(file);

        spinner.succeed('Imported brand guide from markdown');

        console.log('\\nFound the following brand elements:');
        if (partialContext.colors) {
          console.log(chalk.blue('Colors:'));
          Object.entries(partialContext.colors).forEach(([key, value]) => {
            console.log(`  ${key}: ${value}`);
          });
        }
        if (partialContext.typography) {
          console.log(chalk.blue('Typography:'));
          console.log(`  Heading: ${partialContext.typography.fontFamily?.heading}`);
          console.log(`  Body: ${partialContext.typography.fontFamily?.body}`);
        }

        const { shouldComplete } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'shouldComplete',
            message: 'Would you like to complete the setup interactively?',
            default: true
          }
        ]);

        if (shouldComplete) {
          const completeContext = await completeBrandContext(partialContext);
          await brandManager.saveContext(completeContext);
          console.log(chalk.green('\\n✅ Brand guide imported and completed!'));
        }
      } else {
        spinner.fail(`File format not yet supported: ${path.extname(file)}`);
        console.log('Supported formats: .md (more formats coming soon)');
      }

    } catch (error) {
      spinner.fail('Failed to import brand guide');
      console.error(error);
      process.exit(1);
    }
  });

// Check status
program
  .command('status')
  .description('Check Figment configuration status')
  .action(async () => {
    console.log(chalk.blue.bold('🎨 Figment Status'));

    const brandManager = new BrandContextManager();
    const context = await brandManager.loadContext();

    if (!context) {
      console.log(chalk.yellow('❌ No brand context found'));
      console.log('Run `figment init` to set up your brand guide.');
      return;
    }

    console.log(chalk.green('✅ Brand context loaded'));
    console.log(`Brand: ${context.name}`);
    console.log(`Version: ${context.version}`);

    if (context.colors) {
      console.log(chalk.blue('Colors configured:'));
      console.log(`  Primary: ${context.colors.primary}`);
      console.log(`  Secondary: ${context.colors.secondary}`);
    }

    if (context.typography) {
      console.log(chalk.blue('Typography configured:'));
      console.log(`  Heading: ${context.typography.fontFamily.heading}`);
      console.log(`  Body: ${context.typography.fontFamily.body}`);
    }

    // Check if MCP server would work
    console.log('\nMCP Integration:');
    console.log('To use with Claude Desktop, add this to your config:');
    console.log(chalk.gray(`\n{\n  "mcpServers": {\n    "figment": {\n      "command": "figment",\n      "args": ["serve"]\n    }\n  }\n}`));
  });

// Configure Gemini CLI integration
program
  .command('configure-gemini')
  .description('Automate configuration of Gemini CLI to use Figment MCP server')
  .action(async () => {
    console.log(chalk.blue.bold('\n✨ Configuring Gemini CLI for Figment MCP ✨'));

    const geminiConfigPath = path.join(os.homedir(), '.gemini', 'settings.json');
    console.log(`Attempting to configure: ${chalk.cyan(geminiConfigPath)}`);

    let currentConfig: Record<string, unknown> = {};

    try {
      const configContent = await fs.readFile(geminiConfigPath, 'utf8');
      currentConfig = JSON.parse(configContent);
      console.log(chalk.green('Existing Gemini CLI configuration found.'));
    } catch (error: unknown) {
      if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.log(chalk.yellow('Gemini CLI settings.json not found. A new one will be created.'));
      } else {
        console.error(chalk.red(`Error reading or parsing settings.json: ${(error as Error).message}`));
        console.log(chalk.yellow('Please ensure your settings.json is valid JSON or delete it to create a new one.'));
        process.exit(1);
      }
    }

    const figmentMcpConfig = {
      figment: {
        command: 'node', // Use node instead of 'figment'
        args: [path.resolve(__dirname, 'cli.js'), 'serve'], // Full path to CLI
      },
    };

    // Ensure mcpServers object exists
    if (!currentConfig.mcpServers) {
      currentConfig.mcpServers = {};
    }

    // Merge figment config
    currentConfig.mcpServers = {
      ...(currentConfig.mcpServers as Record<string, unknown>),
      ...figmentMcpConfig,
    };

    const newConfigContent = JSON.stringify(currentConfig, null, 2);

    console.log(chalk.yellow('\\nProposed changes to settings.json:'));
    console.log(chalk.gray(newConfigContent));

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Do you want to apply these changes to your Gemini CLI settings.json?',
        default: true,
      },
    ]);

    if (confirm) {
      try {
        await fs.writeFile(geminiConfigPath, newConfigContent, 'utf8');
        console.log(chalk.green('\\n✅ Gemini CLI configured successfully!'));
        console.log('Your Gemini CLI will now automatically start the Figment MCP server when needed.');
        console.log('You do NOT need to manually run `npm run figment -- serve` every time.');
      } catch (error: unknown) {
        console.error(chalk.red(`\\nError writing to settings.json: ${(error as Error).message}`));
        console.log(chalk.yellow('Please check file permissions or try running as administrator/sudo if necessary.'));
        process.exit(1);
      }
    } else {
      console.log(chalk.yellow('\\nConfiguration cancelled. No changes were made.'));
    }
  });


// Configure Claude Code integration
program
  .command('configure-claude')
  .description('Automate configuration of Claude Code to use Figment MCP server')
  .action(async () => {
    console.log(chalk.blue.bold('\\n✨ Configuring Claude Code for Figment MCP ✨'));

    const claudeConfigPath = path.join(process.cwd(), '.mcp.json');
    console.log(`Attempting to configure: ${chalk.cyan(claudeConfigPath)}`);

    let currentConfig: Record<string, unknown> = {};

    try {
      const configContent = await fs.readFile(claudeConfigPath, 'utf8');
      currentConfig = JSON.parse(configContent);
      console.log(chalk.green('Existing Claude Code .mcp.json found.'));
    } catch (error: unknown) {
      if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.log(chalk.yellow('Claude Code .mcp.json not found. A new one will be created in the current directory.'));
      } else {
        console.error(chalk.red(`Error reading or parsing .mcp.json: ${(error as Error).message}`));
        console.log(chalk.yellow('Please ensure your .mcp.json is valid JSON or delete it to create a new one.'));
        process.exit(1);
      }
    }

    const figmentMcpConfig = {
      figment: {
        command: 'node', // Use node instead of 'figment'
        args: [path.resolve(__dirname, 'cli.js'), 'serve'], // Full path to CLI
      },
    };

    // Ensure mcpServers object exists
    if (!currentConfig.mcpServers) {
      currentConfig.mcpServers = {};
    }

    // Merge figment config
    currentConfig.mcpServers = {
      ...(currentConfig.mcpServers as Record<string, unknown>),
      ...figmentMcpConfig,
    };

    const newConfigContent = JSON.stringify(currentConfig, null, 2);

    console.log(chalk.yellow('\nProposed changes to .mcp.json:'));
    console.log(chalk.gray(newConfigContent));

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Do you want to apply these changes to your Claude Code .mcp.json?',
        default: true,
      },
    ]);

    if (confirm) {
      try {
        await fs.writeFile(claudeConfigPath, newConfigContent, 'utf8');
        console.log(chalk.green('\n✅ Claude Code configured successfully!'));
        console.log('Your Claude Code will now automatically connect to the Figment MCP server when needed.');
        console.log('Ensure you run Claude Code from the directory containing this .mcp.json file.');
      } catch (error: unknown) {
        console.error(chalk.red(`\nError writing to .mcp.json: ${(error as Error).message}`));
        console.log(chalk.yellow('Please check file permissions.'));
        process.exit(1);
      }
    } else {
      console.log(chalk.yellow('\nConfiguration cancelled. No changes were made.'));
    }
  });


// Serve MCP server
program
  .command('serve')
  .description('Start the MCP server (used by AI tools)')
  .action(async () => {
    try {
      // Import and start the MCP server from the mcp package
      await import('@figmentdev/mcp');
    } catch (error) {
      console.error('Failed to start MCP server:', error);
      console.error('Make sure all packages are built first: npm run build');
      process.exit(1);
    }
  });


// Generate CSS variables
program
  .command('css')
  .description('Generate CSS custom properties from brand context')
  .option('-o, --output <file>', 'Output file path', 'figment-variables.css')
  .action(async (options) => {
    const brandManager = new BrandContextManager();
    const context = await brandManager.loadContext();

    if (!context) {
      console.error(chalk.red('No brand context found. Run `figment init` first.'));
      process.exit(1);
    }

    const css = brandManager.generateCSSCustomProperties();

    try {
      await fs.writeFile(options.output, css);
      console.log(chalk.green(`✅ CSS variables written to ${options.output}`));
    } catch (error) {
      console.error(chalk.red('Failed to write CSS file:'), error);
      process.exit(1);
    }
  });

async function collectBrandInfo(quick: boolean = false): Promise<BrandContext> {
  const questions = [
    {
      type: 'input',
      name: 'name',
      message: "What's your brand/project name?",
      default: 'My Brand'
    },
    {
      type: 'input',
      name: 'primaryColor',
      message: 'Primary brand color (hex):',
      default: '#3B82F6',
      validate: (input: string) => /^#[0-9A-Fa-f]{6}$/.test(input) || 'Please enter a valid hex color (e.g., #FF00FF)'
    },
    {
      type: 'input',
      name: 'secondaryColor',
      message: 'Secondary brand color (hex):',
      default: '#64748B',
      validate: (input: string) => /^#[0-9A-Fa-f]{6}$/.test(input) || 'Please enter a valid hex color (e.g., #FF00FF)'
    }
  ];

  if (!quick) {
    questions.push(
      {
        type: 'input',
        name: 'accentColor',
        message: 'Accent color (hex, optional):',
        default: '',
        validate: (input: string) => !input || /^#[0-9A-Fa-f]{6}$/.test(input) || 'Please enter a valid hex color (e.g., #FF00FF)'
      },
      {
        type: 'input',
        name: 'headingFont',
        message: 'Heading font family:',
        default: 'Inter, sans-serif'
      },
      {
        type: 'input',
        name: 'bodyFont',
        message: 'Body font family:',
        default: 'Inter, sans-serif'
      },
      {
        type: 'input',
        name: 'baseSpacing',
        message: 'Base spacing unit (px):',
        default: '8',
        validate: (input: string) => (!isNaN(Number(input)) || 'Please enter a number') as any // eslint-disable-line @typescript-eslint/no-explicit-any
      }
    );
  }

  const answers = await inquirer.prompt(questions as any); // eslint-disable-line @typescript-eslint/no-explicit-any

  const brandContext: BrandContext = {
    name: answers.name,
    version: '1.0.0',
    colors: {
      primary: answers.primaryColor,
      secondary: answers.secondaryColor,
      ...(answers.accentColor && { accent: answers.accentColor })
    },
    typography: {
      fontFamily: {
        heading: answers.headingFont || 'Inter, sans-serif',
        body: answers.bodyFont || 'Inter, sans-serif'
      },
      fontSize: {
        base: '16px'
      }
    },
    spacing: {
      base: Number(answers.baseSpacing) || 8,
      scale: [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96]
    },
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };

  return brandContext;
}

async function completeBrandContext(partial: Partial<BrandContext>): Promise<BrandContext> {
  console.log(`\\nLet's complete your brand guide setup...\\n`);

  const questions: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any

  if (!partial.name) {
    questions.push({
      type: 'input',
      name: 'name',
      message: 'Brand/project name:',
      default: 'My Brand'
    });
  }

  // Add missing color questions
  if (!partial.colors?.primary) {
    questions.push({
      type: 'input',
      name: 'primaryColor',
      message: 'Primary brand color (hex):',
      default: '#3B82F6',
      validate: (input: string) => /^#[0-9A-Fa-f]{6}$/.test(input) || 'Please enter a valid hex color (e.g., #3B82F6)'
    });
  }

  if (!partial.colors?.secondary) {
    questions.push({
      type: 'input',
      name: 'secondaryColor',
      message: 'Secondary brand color (hex):',
      default: '#64748B',
      validate: (input: string) => /^#[0-9A-Fa-f]{6}$/.test(input) || 'Please enter a valid hex color (e.g., #64748B)'
    });
  }

  // Add typography questions if missing
  if (!partial.typography?.fontFamily?.heading) {
    questions.push({
      type: 'input',
      name: 'headingFont',
      message: 'Heading font family:',
      default: 'Inter, sans-serif'
    });
  }

  if (!partial.typography?.fontFamily?.body) {
    questions.push({
      type: 'input',
      name: 'bodyFont',
      message: 'Body font family:',
      default: 'Inter, sans-serif'
    });
  }

  const answers = questions.length > 0 ? await inquirer.prompt(questions as any) : {}; // eslint-disable-line @typescript-eslint/no-explicit-any

  // Merge answers with partial context
  const complete: BrandContext = {
    name: partial.name || answers.name || 'My Brand',
    version: '1.0.0',
    colors: {
      primary: partial.colors?.primary || answers.primaryColor,
      secondary: partial.colors?.secondary || answers.secondaryColor,
      ...(partial.colors?.accent && { accent: partial.colors.accent })
    },
    typography: {
      fontFamily: {
        heading: partial.typography?.fontFamily?.heading || answers.headingFont || 'Inter, sans-serif',
        body: partial.typography?.fontFamily?.body || answers.bodyFont || 'Inter, sans-serif'
      },
      fontSize: {
        base: '16px'
      }
    },
    spacing: {
      base: Number(answers.baseSpacing) || 8,
      scale: [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96]
    },
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };

  return complete;
}

program.parse();
