# Figment

**Brand-aware AI code generation that actually follows your design system.**

Transform your brand guidelines into AI context that generates perfectly consistent components across any codebase. No more explaining your colors, typography, and spacing to AI tools, Figment makes them brand-aware automatically.

<div align="center">
  <img 
    src="https://raw.githubusercontent.com/JoshuaPaul20/Figment/main/packages/web/public/Figment.png" 
    alt="Figment Logo" 
    style="margin-bottom: 20px; width: 300px;" 
  />
</div>


## ✨ The Magic

**Before Figment:**
```
You: "Create a primary button component"
AI: *generates random blue button with random styling*
You: "No, use our brand colors and spacing..."
AI: *generates different random styling*
You: *explains your entire design system again*
```

**After Figment:**
```
You: "Create a primary button component"  
AI: *generates perfect button with your exact colors, fonts, spacing, and patterns*
You: ✨ *ships it*
```

## 🚀 Quick Start

### Step-by-Step Installation

**⚠️ IMPORTANT: Run all commands from the root Figment directory unless specified otherwise**

```bash
# 1. Clone the repository
git clone https://github.com/JoshuaPaul20/Figment.git
cd Figment

# 2. Install dependencies and build
npm install
npm run build

# 3. Link CLI globally (FROM ROOT DIRECTORY)
npm link packages/cli

# 4. Go to your project directory
cd /path/to/your/project

# 5. Initialize Figment in your project
figment init

# 6. Configure Claude Code/Desktop
# Add this to your Claude Desktop config:
```

### Claude Desktop Configuration

Add this to your Claude Desktop configuration file:
- **Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "figment": {
      "command": "figment",
      "args": ["serve"]
    }
  }
}
```

**Restart Claude Desktop** after adding this configuration.

## 🎯 Who This Is For

### 🧑‍💻 **Developers**
- Stop manually fixing AI-generated components
- Get consistent styling across your entire codebase  
- Ensure design system compliance without the headache

### 🎨 **Designers** 
- Make AI tools actually use your carefully crafted guidelines
- Turn design tokens into AI-readable context
- Maintain design consistency at scale

### ✨ **Vibe Coders**
- Build side projects that look professional
- Don't think about design systems, just get good results
- AI that "just works" with your aesthetic

## 💡 How It Works

Figment creates a **Model Context Protocol (MCP) server** that your AI tools connect to. This gives them direct access to:

- 🎨 Your brand colors, typography, and spacing
- 📐 Component patterns and design tokens  
- ✅ Validation rules for design compliance
- 🔧 Framework-specific code generation

## 💡 Understanding Figment's Architecture

Unlike a typical `npm install` library or a simple global CLI, Figment is a **local application suite** designed to run on your machine. It's structured as a **monorepo** containing multiple interconnected parts:

*   **`packages/core`**: This is the brain, housing the **Model Context Protocol (MCP) server** that your AI tools connect to, and the logic for managing your brand context.
*   **`packages/web`**: A **full web application** for visually setting up and managing your brand guidelines.
*   **`packages/cli`**: The command-line interface that helps you interact with Figment (e.g., `init`, `serve`, `configure`).

**Why this approach?**

*   **Privacy & Performance:** Your sensitive brand data stays local on your machine, ensuring privacy and lightning-fast responses for your AI.
*   **Offline Capability:** Work with your brand guidelines even without an internet connection.
*   **Comprehensive Tooling:** Provides both a powerful CLI and a user-friendly web interface for managing your brand.
*   **Robust AI Integration:** The MCP server provides a dedicated, stable channel for AI tools to access your brand context.

**Important Workflow Notes:**

*   **Local Server is Key:** For your AI tool to communicate with Figment, the MCP server **must be running** in the background. You start it with `npm run figment -- serve` (keep this terminal window open).
*   **Monorepo Setup:** You clone the entire repository and run `npm install` and `npm run build` to set up this local application. This is different from installing a single npm package.
*   **Robust Configuration:** Commands like `figment configure-gemini` and `figment configure-claude` are designed to robustly configure your AI tool to connect to Figment, even if `figment` isn't directly in your system's PATH. They ensure your AI tool correctly calls the Figment server.

### Supported AI Tools
- ✅ **Claude Desktop / Claude Code** (Primary)
- ✅ Cursor (via MCP extension)
- ✅ Cline (formerly Claude Dev)
- ✅ Any MCP-compatible tool
- 🔄 More integrations coming soon

### Supported Frameworks  
- ✅ React + TypeScript
- ✅ Vue + TypeScript
- ✅ HTML + CSS
- 🔄 Svelte (coming soon)
- 🔄 Angular (coming soon)

## 🎮 Usage Examples

### Basic Setup
```bash
# Interactive brand guide setup
figment init

# Quick setup with defaults
figment init --quick

# Import existing brand guide
figment import brand-guide.md
```

### Using Figment in Your Project

```bash
# In any project directory where you want brand-aware AI:
figment init

# Check if everything is working:
figment status

# Start the web interface (optional):
figment setup --web
```

### Advanced Usage
```bash
# Check your configuration
figment status

# Generate CSS custom properties
figment css --output brand-variables.css

# Start MCP server manually  
figment serve

# Launch visual editor
figment setup --web
```

### Real AI Conversations

Once configured, your AI conversations become magical:

**Component Generation:**
```
You: Create a card component with our brand styling
AI: *generates perfect card with your colors, spacing, and typography*
```

**Design Validation:**
```  
You: Does this CSS follow our brand guidelines? [paste CSS]
AI: ❌ Issues found:
- Using #FF0000 instead of brand primary color #3B82F6
- Font should be Inter, not Arial
```

**Code Examples**

Your AI will generate components like this automatically:

```jsx
// Before Figment: Generic styling
<button className="bg-blue-500 text-white px-4 py-2 rounded">
  Click me
</button>

// After Figment: Your exact brand colors and spacing
<button
  className="px-4 py-2 rounded font-medium transition-colors"
  style={{
    backgroundColor: 'var(--color-primary)',
    fontFamily: 'var(--font-heading)', 
    padding: 'var(--spacing-2) var(--spacing-4)'
  }}
>
  Click me
</button>
```

## 🔧 Troubleshooting

### Common Issues

**❌ "No workspaces found" error**
```bash
# Solution: Always run figment commands from the root Figment directory
cd /path/to/Figment  # Not packages/cli or packages/web
figment setup --web
```

**❌ "figment command not found"**
```bash
# Solution: Re-link the CLI from the root directory
cd /path/to/Figment
npm link packages/cli
```

**❌ Claude Code shows "No MCP servers" or tools not available**
1. Check your Claude Desktop config file exists and has the correct JSON
2. Restart Claude Desktop completely
3. Verify `figment` command works in terminal: `figment status`

**❌ Brand context not found in project**
```bash
# Solution: Initialize Figment in your project directory
cd /path/to/your/project
figment init
# This creates a .figment folder with your brand context
```

### Verification Steps

1. **Check CLI is installed**: `figment --help`
2. **Check brand context exists**: `figment status` 
3. **Check MCP integration**: Open Claude Code, look for "🟢 figment - Ready (4 tools)"
4. **Test generation**: Ask Claude: "Generate a button using my brand colors"

## ⚙️ Configuration Files

### Project Structure After Setup
```
your-project/
└── .figment/
    └── brand-context.json  # Your brand guidelines
```

### Brand Guide Format

Figment uses a simple JSON format:

```json
{
  "name": "My Awesome Brand",
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#64748B", 
    "accent": "#F59E0B"
  },
  "typography": {
    "fontFamily": {
      "heading": "Inter, sans-serif",
      "body": "Inter, sans-serif"
    }
  },
  "spacing": {
    "base": 8,
    "scale": [4, 8, 12, 16, 20, 24, 32, 40, 48, 64]
  }
}
```

## 🛠️ Commands

Complete CLI reference:

```bash
figment init                    # Set up brand guide interactively
figment init --quick            # Quick setup with minimal prompts
figment status                  # Check configuration status
figment import <file>           # Import from markdown/JSON
figment css --output <file>     # Generate CSS custom properties
figment serve                   # Start MCP server
figment setup --web             # Launch visual editor
figment configure-claude        # Auto-configure Claude Code
figment configure-gemini        # Auto-configure Gemini CLI
figment --help                  # Show all commands
```

## 🏛️ Project Structure

```
Figment/
├── packages/
│   ├── cli/           # Command-line interface (@figmentdev/figment)
│   ├── core/          # MCP server and brand logic  
│   └── web/           # Visual brand editor (Next.js)
├── examples/          # Example brand configurations
└── docs/             # Documentation and guides
```

## 🧑‍💻 Development

### Setup
```bash
git clone https://github.com/JoshuaPaul20/Figment.git
cd Figment
npm install
npm run build
```

### Development Commands
```bash
npm run dev          # Start all packages in development
npm run build        # Build all packages  
npm run test         # Run tests
npm run lint         # Lint code
npm run clean        # Clean build artifacts
```

### Testing CLI Locally
```bash
npm run build
cd packages/cli
npm link
figment --help
```

## 🤝 Contributing

We'd love your help making Figment better!

- 🐛 [Issues](https://github.com/JoshuaPaul20/Figment/issues) - Bug reports and feature requests
- 💡 [Discussions](https://github.com/JoshuaPaul20/Figment/discussions) - Ideas and questions  
- 🔧 [Pull Requests](https://github.com/JoshuaPaul20/Figment/pulls) - Code contributions

### Roadmap
- [ ] **npm package** - `npm install -g @figmentdev/figment` (coming soon!)
- [ ] Figma plugin for direct import
- [ ] More framework support (Svelte, Angular)  
- [ ] Advanced component pattern matching  
- [ ] Team collaboration features
- [ ] Design system analytics
- [ ] Browser extension for design token extraction

## 📄 License

Copyright (c) 2024 Joshua Paul. All rights reserved. See [LICENSE](LICENSE) file for details.

## 💬 Community & Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/JoshuaPaul20/Figment/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/JoshuaPaul20/Figment/discussions)  
- 📧 **Email**: Support via GitHub Issues
- 🐦 **Updates**: Watch this repo for releases

---

<div align="center">

**Made with ❤️ for designers, developers, and vibe coders everywhere.**

[⭐ Star us on GitHub](https://github.com/JoshuaPaul20/Figment) • [🚀 Get Started](#-quick-start) • [📖 Read More](https://github.com/JoshuaPaul20/Figment/tree/main/docs)

</div>
