# Figment Brand Examples

This directory contains example brand configurations to help you get started with Figment quickly.

## Available Examples

### 🚀 [startup-brand.json](./startup-brand.json)
Modern, clean brand perfect for early-stage startups and SaaS products.
- **Colors**: Blue primary with neutral grays
- **Typography**: Inter for clean, readable text
- **Style**: Minimal, professional, trustworthy

**Use this for**: Tech startups, SaaS platforms, B2B products

### 🎨 [creative-agency.json](./creative-agency.json)  
Bold, vibrant brand for creative agencies and design studios.
- **Colors**: Purple and pink gradient with vibrant accents
- **Typography**: Poppins for headings, Inter for body
- **Style**: Creative, bold, eye-catching

**Use this for**: Design agencies, creative studios, artistic projects

## How to Use Examples

### Option 1: Import Directly
```bash
# Download and import an example
curl -o startup-brand.json https://raw.githubusercontent.com/JoshuaPaul20/Figment/main/examples/startup-brand.json
figment import startup-brand.json
```

### Option 2: Copy to Your Project
```bash
# Clone the repo and copy examples
git clone https://github.com/JoshuaPaul20/Figment.git
cp Figment/examples/startup-brand.json ./my-brand.json
figment import my-brand.json
```

### Option 3: Use as Starting Point
Copy an example and modify it to match your brand:

1. Download an example that's closest to your style
2. Edit the colors, fonts, and spacing to match your brand  
3. Import your customized version: `figment import my-custom-brand.json`

## Creating Your Own

After importing an example, you can customize it further:

```bash
# Check what was imported
figment status

# Generate CSS variables
figment css --output brand-variables.css

# Start using with your AI tools
figment serve
```

## Brand Configuration Format

Each example follows this structure:

```json
{
  "name": "Brand Name",
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
  },
  "components": {
    "button": {
      "base": { /* shared styles */ },
      "variants": {
        "primary": { /* variant-specific styles */ }
      }
    }
  }
}
```

## Contributing Examples

Have a great brand configuration? We'd love to include it! 

1. Create a new JSON file following the format above
2. Add it to the examples directory
3. Update this README with a description
4. Submit a pull request

**Example categories we're looking for:**
- Corporate/Enterprise
- E-commerce/Retail  
- Healthcare/Medical
- Education/Learning
- Finance/Fintech
- Non-profit/Social
- Gaming/Entertainment
- Food & Beverage