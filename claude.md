# CLAUDE.md - Figment Project Guide

## Project Overview

Figment is a brand-aware AI code generation tool that ensures AI-generated components follow your brand guidelines automatically. It consists of a command-line interface (CLI), a web application for visual brand guide setup, and a core library that powers the MCP (Model Context Protocol) server.

**Architecture:**

*   **Monorepo:** The project is a monorepo using npm workspaces, with three main packages:
    *   `packages/core`: Contains the core logic for the MCP server and brand context management.
    *   `packages/cli`: Implements the command-line interface for Figment.
    *   `packages/web`: A Next.js application that provides a web-based interface for brand guide setup.
*   **Technology Stack:**
    *   **Backend & CLI:** Node.js, TypeScript, `@modelcontextprotocol/sdk`, `commander`, `inquirer`
    *   **Frontend:** Next.js, React, TypeScript, Tailwind CSS
    *   **Tooling:** `tsup` for bundling, `eslint` for linting, `prettier` for formatting, and `vitest` for testing.

## Building and Running

### Entire Project

*   **Build all packages:** `npm run build`
*   **Run all packages in development mode:** `npm run dev`

### Individual Packages

*   **Core Package:**
    *   **Build:** `npm run build -w packages/core`
    *   **Development:** `npm run dev -w packages/core`
*   **CLI Package:**
    *   **Build:** `npm run build -w packages/cli`
    *   **Development:** `npm run dev -w packages/cli`
*   **Web Package:**
    *   **Build:** `npm run build -w packages/web`
    *   **Development:** `npm run dev -w packages/web` (runs on `http://localhost:3456`)

### Running the CLI

After building the CLI, you can run it from the root of the project:

```bash
npm run figment -- [command]
```

For example:

```bash
npm run figment -- init
npm run figment -- status
```

## Integrating with Claude Code (MCP Server)

Figment exposes a Model Context Protocol (MCP) server that Claude Code can connect to for brand-aware code generation. To use Figment with Claude Code, you'll need to configure Claude Code to connect to the Figment MCP server.

First, start the Figment MCP server:

```bash
npm run figment -- serve
```

This command will start the server and keep it running. You'll need to keep this process active while using Claude Code.

### Configuring Claude Code

To configure Claude Code to use the Figment MCP server, you need to add the server configuration to your Claude Code settings. The configuration should be added to your MCP settings file (typically found in your Claude Code configuration directory):

```json
{
  "mcpServers": {
    "figment": {
      "command": "node",
      "args": ["path/to/figment/packages/cli/dist/cli.js", "serve"],
      "env": {}
    }
  }
}
```

Alternatively, if you have Figment installed globally or accessible via npm scripts:

```json
{
  "mcpServers": {
    "figment": {
      "command": "npm",
      "args": ["run", "figment", "--", "serve"],
      "cwd": "/path/to/figment/project"
    }
  }
}
```

### Available Resources and Tools

Once configured, Claude Code will be able to:

*   **Access Brand Resources:** Query resources like:
    *   `figment://brand-guidelines` - Markdown formatted brand guidelines
    *   `figment://css-variables` - CSS custom properties for your brand
    *   `figment://brand-context` - Raw JSON brand data
    *   `figment://component-patterns` - Reusable component patterns

*   **Utilize Figment Tools:** Call tools exposed by the Figment MCP server:
    *   `get_brand_colors` - Retrieve brand color palette
    *   `get_typography_styles` - Get typography configuration
    *   `get_spacing_scale` - Access spacing system
    *   `get_component_pattern` - Retrieve specific component patterns
    *   `validate_design_compliance` - Check if code follows brand guidelines
    *   `generate_component_code` - Generate brand-compliant component code

### Usage Examples

With Figment connected to Claude Code, you can:

1. **Generate Brand-Compliant Components:**
   ```
   Create a primary button component following our brand guidelines
   ```

2. **Validate Existing Code:**
   ```
   Check if this component follows our brand guidelines: [paste code]
   ```

3. **Access Brand Information:**
   ```
   What are our primary brand colors?
   What typography styles should I use for headings?
   ```

4. **Generate Styled Components:**
   ```
   Create a card component with proper spacing and colors from our brand guide
   ```

## Development Conventions

*   **Coding Style:** The project uses TypeScript with strict type checking. Code is formatted with Prettier and linted with ESLint. Please adhere to the existing coding style.
*   **Monorepo Structure:** All code is organized into packages within the `packages` directory. When making changes, please ensure they are made in the correct package.
*   **Testing:** The `core` package is set up with `vitest` for unit testing. When adding new features to the core library, please include unit tests.
*   **Commits:** Please write clear and descriptive commit messages.

## Troubleshooting

### Common Issues

1. **MCP Server Not Starting:**
   - Ensure all dependencies are installed: `npm install`
   - Build the project: `npm run build`
   - Check that the CLI is working: `npm run figment -- --help`

2. **Claude Code Not Connecting:**
   - Verify the MCP server configuration path is correct
   - Ensure the Figment MCP server is running
   - Check Claude Code logs for connection errors

3. **Brand Guidelines Not Loading:**
   - Ensure `figment.md` exists in your project root
   - Run `npm run figment -- init` to set up initial brand guidelines
   - Check that the brand guide format is valid

### Getting Help

For issues specific to Figment, check the project's GitHub repository or documentation. For Claude Code integration issues, refer to Claude Code's MCP documentation.