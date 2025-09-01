# Figment

**Brand-aware AI code generation that actually follows your design system.**

<div align="center">
  <img 
    src="https://raw.githubusercontent.com/JoshuaPaul20/Figment/main/packages/web/public/Figment.png" 
    alt="Figment Logo" 
    style="margin-bottom: 20px; width: 300px;" 
  />
</div>

## The Problem

AI code generation is amazing, but it doesn't understand your brand. Every time you ask ChatGPT, Claude, or GitHub Copilot to create a component, you get:

- **Random colors** instead of your brand palette
- **Generic fonts** instead of your typography system  
- **Arbitrary spacing** instead of your design tokens
- **Inconsistent styling** across your entire codebase

Then you spend time manually fixing everything to match your design system.

## The Solution

Figment transforms your brand guidelines into AI context that generates perfectly consistent components. No more explaining your colors, typography, and spacing to AI tools—Figment makes them brand-aware automatically.

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

---

## 🧑‍💻 For Developers: CLI Setup

Perfect for developers who want AI tools to generate code that follows their design system automatically.

### Prerequisites
- Node.js 18+ installed
- Claude Desktop/Code or other MCP-compatible AI tool

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/JoshuaPaul20/Figment.git
cd Figment

# 2. Install dependencies and build
npm install
npm run build

# 3. Link CLI globally 
cd packages/cli
npm link
```

### Setup Your Brand

```bash
# Go to your project directory
cd /path/to/your/project

# Initialize Figment (creates .figment/brand-context.json)
figment init

# Follow the prompts to set up:
# - Brand name
# - Primary/secondary colors  
# - Typography (heading & body fonts)
# - Base spacing unit
```

### Configure Your AI Tool

#### Claude Desktop/Code
Add this to your Claude Desktop config:
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

#### Other AI Tools
- **Cursor**: Install MCP extension and use same config
- **Cline**: Add MCP configuration 
- Any MCP-compatible tool works the same way

### Verify Setup

```bash
# Check CLI is working
figment status

# Should show your brand configuration
```

In Claude Code, you should see: `🟢 figment - Ready (4 tools)`

### Start Coding!

Now when you ask Claude to generate components, it will automatically use your brand guidelines:

```jsx
// Ask: "Create a primary button component"
// Claude generates with your exact brand styling:

<button
  className="px-4 py-2 rounded font-medium transition-colors"
  style={{
    backgroundColor: 'var(--color-primary)', // Your brand color
    fontFamily: 'var(--font-heading)',       // Your brand font
    padding: 'var(--spacing-2) var(--spacing-4)' // Your spacing scale
  }}
>
  Click me
</button>
```

---

## 🎨 For Designers & Vibe Coders: Visual Setup

Perfect for designers and non-technical users who want a visual interface to set up their brand guidelines.

### Quick Visual Setup

```bash
# 1. Clone and install (one-time setup)
git clone https://github.com/JoshuaPaul20/Figment.git
cd Figment
npm install
npm run build

# 2. Launch the visual brand editor
figment setup --web
```

This opens a beautiful web interface at `http://localhost:3456` where you can:

- **🎨 Set colors** with a visual color picker
- **✏️ Choose fonts** from Google Fonts integration  
- **📐 Configure spacing** with visual spacing scales
- **👀 Preview components** with your brand styling
- **📤 Export config** to share with developers

### Using the Web Interface

1. **Brand Setup**: Enter your project name and choose colors visually
2. **Typography**: Select fonts and see them applied in real-time
3. **Spacing**: Set your base spacing unit and see the generated scale
4. **Preview**: See how buttons, cards, and other components look
5. **Export**: Download your brand config or copy to clipboard

### Share with Your Team

Once you've set up your brand visually:

```bash
# Your brand config is saved automatically
# Share the .figment/brand-context.json file with developers
# Or export from the web interface
```

Developers can then use this config file in their AI coding workflow!

---

## 💡 How Figment Works

Figment creates a **Model Context Protocol (MCP) server** that your AI tools connect to. This gives them direct access to:

- 🎨 Your brand colors, typography, and spacing
- 📐 Component patterns and design tokens  
- ✅ Validation rules for design compliance
- 🔧 Framework-specific code generation

### Architecture Overview

Figment is structured as a **local application suite**:

- **`packages/core`**: MCP server and brand logic engine
- **`packages/cli`**: Command-line interface for developers  
- **`packages/web`**: Visual brand editor for designers

**Why local?** Your brand data stays on your machine for privacy, works offline, and provides lightning-fast responses.

---

## 🚀 Advanced Usage

### CLI Commands

```bash
figment init                    # Interactive brand setup
figment init --quick            # Quick setup with minimal prompts
figment status                  # Check configuration status
figment css --output <file>     # Generate CSS custom properties
figment serve                   # Start MCP server manually
figment setup --web             # Launch visual brand editor
```

### Brand Configuration Format

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

### Supported Frameworks
- ✅ React + TypeScript
- ✅ Vue + TypeScript
- ✅ HTML + CSS
- 🔄 Svelte (coming soon)
- 🔄 Angular (coming soon)

---

## 🔧 Troubleshooting

### "No workspaces found" error when running `figment setup --web`
```bash
# Solution: Run from the root Figment directory
cd /path/to/Figment  # Must be the root directory with package.json
figment setup --web

# NOT from packages/cli or packages/web subdirectories
```

### "figment command not found"
```bash
# Solution: Re-link the CLI from the CLI directory
cd /path/to/Figment/packages/cli
npm link
```

### Claude Code shows "No MCP servers" or tools not available
1. Check your Claude Desktop config file exists and has the correct JSON
2. Restart Claude Desktop completely
3. Verify `figment` command works in terminal: `figment status`

### Brand context not found in project
```bash
# Solution: Initialize Figment in your project directory
cd /path/to/your/project
figment init
# This creates a .figment folder with your brand context
```

### Verification Checklist

1. **CLI installed**: `figment --help` shows commands
2. **Brand context exists**: `figment status` shows your brand
3. **MCP integration**: Claude Code shows "🟢 figment - Ready (4 tools)"
4. **Test generation**: Ask Claude: "Generate a button using my brand colors"

---

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

---

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

---

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

---

## 📄 License

Copyright (c) 2024 Joshua Paul. All rights reserved. See [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for designers, developers, and vibe coders everywhere.**

[⭐ Star us on GitHub](https://github.com/JoshuaPaul20/Figment) • [🚀 Get Started](#-for-developers-cli-setup) • [🎨 Visual Setup](#-for-designers--vibe-coders-visual-setup)

</div>