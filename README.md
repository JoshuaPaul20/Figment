# 🎨 Figment

**Brand-aware AI code generation that actually follows your design system.**

Transform your brand guidelines into AI context that generates perfectly consistent components across any codebase. No more explaining your colors, typography, and spacing to AI tools—Figment makes them brand-aware automatically.

<div align="center">
  <img src="https://raw.githubusercontent.com/JoshuaPaul20/Figment/main/packages/web/public/Figment.png" alt="Figment Logo" style="margin-bottom: 20px;" />
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

### Quick Install from GitHub
```bash
git clone https://github.com/JoshuaPaul20/Figment.git && cd Figment && npm install && npm run build && npm link packages/cli && figment init
```

### Step-by-Step Installation
```bash
# 1. Clone and install
git clone https://github.com/JoshuaPaul20/Figment.git
cd Figment
npm install
npm run build

# 2. Link CLI globally
cd packages/cli  
npm link

# 3. Set up your brand
figment init

# 4. Configure your AI tool
figment configure-claude  # or configure-gemini

# 5. Start coding with brand-aware AI! 🎉
```

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

### Supported AI Tools
- ✅ Claude Desktop / Claude Code
- ✅ Cursor  
- ✅ Cline (formerly Claude Dev)
- ✅ Windsurf
- ✅ Gemini CLI
- ✅ Any MCP-compatible tool

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

### AI Tool Configuration
```bash
# Auto-configure Claude Code
figment configure-claude

# Auto-configure Gemini CLI  
figment configure-gemini
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

## ⚙️ Configuration

### AI Tool Setup

#### Claude Desktop  
Add to your `~/Library/Application Support/Claude/claude_desktop_config.json`:
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

Or just run: `figment configure-claude`

#### Cursor & Other Tools
Use the MCP extension or add similar configuration. Run `figment configure-claude` for auto-setup.

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