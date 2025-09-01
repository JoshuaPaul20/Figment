# Publishing Guide

This guide covers how to publish Figment to npm and make it available for users to install globally.

## Pre-Publication Checklist

### ✅ Code Quality
- [ ] All builds pass (`npm run build`)
- [ ] All tests pass (`npm test`) 
- [ ] Linting passes (`npm run lint`)
- [ ] CLI works locally (`figment --version`, `figment --help`)

### ✅ Documentation  
- [ ] Main README.md is comprehensive and up-to-date
- [ ] CLI package README.md exists
- [ ] Examples directory has sample configurations
- [ ] LICENSE file exists
- [ ] Repository URLs are correct in package.json files

### ✅ Package Configuration
- [ ] CLI package name is `@figmentdev/figment`
- [ ] Binary is configured as `"figment": "dist/cli.js"`
- [ ] Files array includes `["dist", "README.md", "LICENSE"]`
- [ ] Repository, homepage, and bugs URLs point to correct GitHub repo
- [ ] Version numbers are consistent

### ✅ Testing
- [ ] Test global installation: `npm pack` then `npm install -g ./package.tgz`
- [ ] Test MCP server starts: `figment serve`
- [ ] Test brand guide creation: `figment init`
- [ ] Test with actual AI tool (Claude Desktop/Code)

## Publishing Steps

### 1. Version Update
```bash
# Update version in CLI package
cd packages/cli
npm version patch  # or minor/major

# Update version in root package if needed
cd ../..
npm version patch
```

### 2. Final Build & Test
```bash
# Clean and rebuild everything
npm run clean
npm install  
npm run build

# Test CLI package
cd packages/cli
npm pack --dry-run  # Check what will be included
npm pack           # Create actual tarball

# Test installation
npm install -g ./figmentdev-figment-*.tgz
figment --version
figment --help

# Clean up test installation  
npm uninstall -g @figmentdev/figment
rm *.tgz
```

### 3. Publish to npm

**First time setup:**
```bash
npm login
# Enter your npm credentials
```

**Publish CLI package:**
```bash
cd packages/cli

# Dry run to see what would be published
npm publish --dry-run

# Actually publish (requires npm account with @figmentdev org access)
npm publish --access public
```

### 4. Verify Publication
```bash
# Test installation from npm
npm install -g @figmentdev/figment
figment --version

# Clean up
npm uninstall -g @figmentdev/figment
```

### 5. Create GitHub Release
```bash
# Tag the release
git tag v0.1.0
git push origin v0.1.0

# Create release on GitHub with:
# - Release title: "v0.1.0 - Initial Release"  
# - Description: Copy from CHANGELOG or summarize key features
# - Attach the .tgz file as release asset
```

## Publishing Troubleshooting

### Common Issues

**"Package name already exists"**
- Check if someone else registered `@figmentdev/figment`
- Consider alternative name like `figment-cli` or `@yourname/figment`

**"403 Forbidden"**
- You don't have permission to publish under `@figmentdev` scope
- Either get added to the org or use a different scope

**"Shebang not working"**
- Check `tsup.config.ts` has correct banner configuration
- Verify `dist/cli.js` starts with `#!/usr/bin/env node`
- Ensure file has executable permissions

**"Command not found after install"**
- Verify `bin` field in package.json points to correct file
- Check if `dist/cli.js` exists and is executable
- Try `npm ls -g` to see if package installed correctly

### Recovery Steps

If publish fails partway through:
```bash
# Check what version is live
npm view @figmentdev/figment

# If version exists but is broken, you'll need to:
# 1. Fix the issue
# 2. Bump version (you can't republish same version)
# 3. Try again
```

## Automated Publishing (Future)

Consider setting up GitHub Actions for automated publishing:

```yaml
# .github/workflows/publish.yml
name: Publish to npm

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: cd packages/cli && npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Post-Publication

After successful publication:

1. **Update Documentation**: Verify installation instructions work
2. **Social Media**: Announce the release 
3. **Community**: Share in relevant Discord/Slack channels
4. **User Testing**: Ask early users to test installation
5. **Monitor**: Watch for GitHub issues and npm download stats

## Version Management

Follow semantic versioning:
- **Patch** (0.1.0 → 0.1.1): Bug fixes, small improvements
- **Minor** (0.1.0 → 0.2.0): New features, backward compatible
- **Major** (0.1.0 → 1.0.0): Breaking changes

For pre-1.0.0, minor versions can include breaking changes.