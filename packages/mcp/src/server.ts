// Removed unused imports
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { BrandContextManager } from '@figmentdev/sdk/brand-context';
import type { FigmentTool } from '@figmentdev/sdk/types';

class FigmentMCPServer {
  private server: Server;
  brandManager: BrandContextManager;

  constructor() {
    this.server = new Server(
      {
        name: 'figment-mcp-server',
        version: '0.1.0',
        description: 'Brand-aware AI code generation MCP server'
      },
      {
        capabilities: {
          resources: {
            'figment://brand-guidelines': {
              uri: 'figment://brand-guidelines',
              name: 'Brand Guidelines',
              description: 'Complete brand guidelines and component patterns for AI code generation',
              access: ['read'],
              mimeType: 'text/markdown',
            },
            'figment://css-variables': {
              uri: 'figment://css-variables',
              name: 'CSS Custom Properties',
              description: 'CSS custom properties generated from brand context',
              access: ['read'],
              mimeType: 'text/css',
            },
            'figment://brand-context': {
              uri: 'figment://brand-context',
              name: 'Brand Context JSON',
              description: 'Raw brand context data in JSON format',
              access: ['read'],
              mimeType: 'application/json',
            },
          },
          tools: {
            get_brand_colors: {
              name: 'get_brand_colors',
              description: 'Get brand colors for use in components',
              inputSchema: {
                type: 'object',
                properties: {
                  format: {
                    type: 'string',
                    enum: ['hex', 'rgb', 'hsl', 'css-var'],
                    description: 'Color format to return',
                    default: 'hex'
                  }
                }
              }
            },
            get_component_pattern: {
              name: 'get_component_pattern',
              description: 'Get CSS classes or styles for a specific component type',
              inputSchema: {
                type: 'object',
                properties: {
                  component: {
                    type: 'string',
                    enum: ['button', 'input', 'card', 'modal'],
                    description: 'Component type to get pattern for'
                  },
                  variant: {
                    type: 'string',
                    description: 'Component variant (e.g., primary, secondary, outline)',
                    default: 'default'
                  }
                },
                required: ['component']
              }
            },
            validate_design_compliance: {
              name: 'validate_design_compliance',
              description: 'Validate if provided CSS or component follows brand guidelines',
              inputSchema: {
                type: 'object',
                properties: {
                  css: {
                    type: 'string',
                    description: 'CSS code to validate against brand guidelines'
                  },
                  component: {
                    type: 'string',
                    description: 'Component type being validated'
                  }
                },
                required: ['css']
              }
            },
            generate_component_code: {
              name: 'generate_component_code',
              description: 'Generate React/HTML component code following brand guidelines',
              inputSchema: {
                type: 'object',
                properties: {
                  component: {
                    type: 'string',
                    description: 'Type of component to generate'
                  },
                  framework: {
                    type: 'string',
                    enum: ['react', 'vue', 'html', 'svelte'],
                    description: 'Framework to generate code for',
                    default: 'react'
                  },
                  props: {
                    type: 'object',
                    description: 'Component properties and content',
                    default: {}
                  }
                },
                required: ['component']
              }
            }
          },
        },
      }
    );

    this.brandManager = new BrandContextManager();
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, this.handleListResources.bind(this));
    this.server.setRequestHandler(ReadResourceRequestSchema, this.handleReadResource.bind(this));
    this.server.setRequestHandler(ListToolsRequestSchema, this.handleListTools.bind(this));
    this.server.setRequestHandler(CallToolRequestSchema, this.handleCallTool.bind(this));
  }

  async handleListResources() {
    const context = await this.brandManager.loadContext();
    
    const resources = [
      {
        uri: 'figment://brand-guidelines',
        mimeType: 'text/markdown',
        name: 'Brand Guidelines',
        description: 'Complete brand guidelines and component patterns for AI code generation'
      },
      {
        uri: 'figment://css-variables',
        mimeType: 'text/css',
        name: 'CSS Custom Properties',
        description: 'CSS custom properties generated from brand context'
      }
    ];

    if (context) {
      resources.push({
        uri: 'figment://brand-context',
        mimeType: 'application/json',
        name: 'Brand Context JSON',
        description: 'Raw brand context data in JSON format'
      });
    }

    return { resources };
  }

  async handleReadResource(request: { params: { uri: string } }) {
    const { uri } = request.params;
    
    switch (uri) {
      case 'figment://brand-guidelines': {
        const guidelines = this.brandManager.generateComponentGuidelines();
        return {
          contents: [{
            uri,
            mimeType: 'text/markdown',
            text: guidelines
          }]
        };
      }

      case 'figment://css-variables': {
        const cssVars = this.brandManager.generateCSSCustomProperties();
        return {
          contents: [{
            uri,
            mimeType: 'text/css',
            text: cssVars
          }]
        };
      }

      case 'figment://brand-context': {
        const context = this.brandManager.getContext();
        if (!context) {
          throw new Error('No brand context available. Run `figment init` to set up your brand guide.');
        }
        return {
          contents: [{
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(context, null, 2)
          }]
        };
      }

      default:
        throw new Error(`Unknown resource: ${uri}`);
    }
  }

  async handleListTools() {
    const tools: FigmentTool[] = [
      {
        name: 'get_brand_colors',
        description: 'Get brand colors for use in components',
        inputSchema: {
          type: 'object',
          properties: {
            format: {
              type: 'string',
              enum: ['hex', 'rgb', 'hsl', 'css-var'],
              description: 'Color format to return',
              default: 'hex'
            }
          }
        }
      },
      {
        name: 'get_component_pattern',
        description: 'Get CSS classes or styles for a specific component type',
        inputSchema: {
          type: 'object',
          properties: {
            component: {
              type: 'string',
              enum: ['button', 'input', 'card', 'modal'],
              description: 'Component type to get pattern for'
            },
            variant: {
              type: 'string',
              description: 'Component variant (e.g., primary, secondary, outline)',
              default: 'default'
            }
          },
          required: ['component']
        }
      },
      {
        name: 'validate_design_compliance',
        description: 'Validate if provided CSS or component follows brand guidelines',
        inputSchema: {
          type: 'object',
          properties: {
            css: {
              type: 'string',
              description: 'CSS code to validate against brand guidelines'
            },
            component: {
              type: 'string',
              description: 'Component type being validated'
            }
          },
          required: ['css']
        }
      },
      {
        name: 'generate_component_code',
        description: 'Generate React/HTML component code following brand guidelines',
        inputSchema: {
          type: 'object',
          properties: {
            component: {
              type: 'string',
              description: 'Type of component to generate'
            },
            framework: {
              type: 'string',
              enum: ['react', 'vue', 'html', 'svelte'],
              description: 'Framework to generate code for',
              default: 'react'
            },
            props: {
              type: 'object',
              description: 'Component properties and content',
              default: {}
            }
          },
          required: ['component']
        }
      }
    ];

    return { tools };
  }

  async handleCallTool(request: { params: { name: string; arguments?: Record<string, unknown> } }) {
    const { name, arguments: args = {} } = request.params;

    switch (name) {
      case 'get_brand_colors':
        return this.getBrandColors(args);

      case 'get_component_pattern':
        return this.getComponentPattern(args);

      case 'validate_design_compliance':
        return this.validateDesignCompliance(args);

      case 'generate_component_code':
        return this.generateComponentCode(args);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }


  private async getBrandColors(args: Record<string, unknown>) {
    const context = await this.brandManager.loadContext();
    if (!context?.colors) {
      return {
        content: [{
          type: 'text',
          text: 'No brand colors configured. Run `figment init` to set up your brand guide.'
        }]
      };
    }

    const format = (args.format as string) || 'hex';
    const colors = context.colors;
    
    let result: string;
    switch (format) {
      case 'css-var':
        result = `Primary: var(--color-primary)\nSecondary: var(--color-secondary)`;
        if (colors.accent) result += `\nAccent: var(--color-accent)`;
        break;
      default:
        result = `Primary: ${colors.primary}\nSecondary: ${colors.secondary}`;
        if (colors.accent) result += `\nAccent: ${colors.accent}`;
    }

    return {
      content: [{
        type: 'text',
        text: result
      }]
    };
  }

  private async getComponentPattern(args: Record<string, unknown>) {
    const context = await this.brandManager.loadContext();
    if (!context?.components) {
      return {
        content: [{
          type: 'text',
          text: 'No component patterns configured. The generated components will use basic styling.'
        }]
      };
    }

    const { component, variant = 'default' } = args;
    const componentPatterns = context.components;
    
    let styles: Record<string, unknown> = {};

    switch (component) {
      case 'button': {
        if (componentPatterns.button) {
          let currentStyles: Record<string, unknown> = {};
          if (componentPatterns.button.base) {
            currentStyles = { ...componentPatterns.button.base };
          }
          if (variant && componentPatterns.button.variants && (componentPatterns.button.variants as Record<string, unknown>)[variant as string]) {
            currentStyles = { ...currentStyles, ...((componentPatterns.button.variants as Record<string, unknown>)[variant as string] ?? {}) };
          }
          styles = currentStyles;
        }
        break;
      }
        
      case 'input': {
        if (componentPatterns.input) {
          let currentStyles: Record<string, unknown> = {};
          if (componentPatterns.input.base) {
            currentStyles = { ...componentPatterns.input.base };
          }
          if (variant && componentPatterns.input.states && (componentPatterns.input.states as Record<string, unknown>)[variant as string]) {
            currentStyles = { ...currentStyles, ...((componentPatterns.input.states as Record<string, unknown>)[variant as string] ?? {}) };
          }
          styles = currentStyles;
        }
        break;
      }
        
      case 'card': {
        if (componentPatterns.card) {
          let currentStyles: Record<string, unknown> = {};
          if (componentPatterns.card.base) {
            currentStyles = { ...componentPatterns.card.base };
          }
          if (variant && componentPatterns.card.variants && (componentPatterns.card.variants as Record<string, unknown>)[variant as string]) {
            currentStyles = { ...currentStyles, ...((componentPatterns.card.variants as Record<string, unknown>)[variant as string] ?? {}) };
          }
          styles = currentStyles;
        }
        break;
      }
        
default:
        return {
          content: [{
            type: 'text',
            text: `Component pattern for "${component}" not found.`
          }]
        };
    }

    return {
      content: [{
        type: 'json',
        json: styles
      }]
    };
  }

  private async validateDesignCompliance(args: Record<string, unknown>) {
    const context = await this.brandManager.loadContext();
    const { css } = args;
    
    if (!context) {
      return {
        content: [{
          type: 'text',
          text: 'Cannot validate compliance - no brand context available.'
        }]
      };
    }

    // Simple validation logic - check if brand colors are used
    const issues: string[] = [];
    const brandColors = [
      context.colors?.primary,
      context.colors?.secondary,
      context.colors?.accent
    ].filter(Boolean);

    let hasValidColors = false;
    brandColors.forEach(color => {
      if (color && (css as string).includes(color)) {
        hasValidColors = true;
      }
    });

    if (!hasValidColors && brandColors.length > 0) {
      issues.push('No brand colors detected in CSS');
    }

    // Check for font families
    if (context.typography?.fontFamily.body && !(css as string).includes(context.typography.fontFamily.body)) {
      issues.push('Brand typography not detected');
    }

    const result = issues.length === 0 
      ? '✅ Design appears to comply with brand guidelines'
      : `❌ Issues found:\n${issues.map(issue => `- ${issue}`).join('\n')}`;

    return {
      content: [{
        type: 'text',
        text: result
      }]
    };
  }

  private async generateComponentCode(args: Record<string, unknown>) {
    const context = await this.brandManager.loadContext();
    const { component, framework = 'react', props = {} } = args;

    if (!context) {
      return {
        content: [{
          type: 'text',
          text: 'Cannot generate component code - no brand context available. Run `figment init`.'
        }]
      };
    }

    // This is a simplified example - in a real implementation you'd have more sophisticated code generation
    let code = '';
    
    if (framework === 'react') {
      switch (component) {
        case 'button': {
          const buttonStylesResponse = await this.getComponentPattern({ component: 'button', variant: (props as Record<string, unknown>).variant || 'primary' });
          let buttonStyles: Record<string, unknown> = {};
          // Type guard to ensure 'json' property exists
          const isJsonContent = (content: Record<string, unknown>): content is { type: string; json: Record<string, unknown> } => {
            return content && content.type === 'json' && typeof content.json === 'object';
          };
          if (buttonStylesResponse.content && buttonStylesResponse.content[0] && isJsonContent(buttonStylesResponse.content[0])) {
            buttonStyles = buttonStylesResponse.content[0].json;
          }
          
          const styleString = Object.entries(buttonStyles)
            .map(([key, value]) => `${key}: '${value}'`).join(',\n        ');

          code = `
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false
}) => {
  return (
    <button
      style={{
        ${styleString},
        fontFamily: context.typography?.fontFamily?.body ?? 'system-ui',
        fontWeight: context.typography?.fontWeight?.normal ?? 400,
        lineHeight: context.typography?.lineHeight?.normal ?? 1.5,
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
`;
          break;
        }
        default:
          code = `// Component type "${component}" not yet supported`;
      }
    }

    return {
      content: [{
        type: 'text',
        text: code.trim()
      }]
    };
  }

  async start() {
    // Load existing brand context if available
    const context = await this.brandManager.loadContext();

    if (!context) {
      console.error('WARNING: No brand context found. Users should run `figment init` first.');
      // You might want to expose this as a tool to help users
    } else {
      console.error(`Figment MCP Server running with brand: ${context.name}`);
    }

    // Suppress stdout logging to avoid corrupting JSON-RPC messages

    console.log = (...args) => console.error('[LOG]', ...args);
    console.warn = (...args) => console.error('[WARN]', ...args);

    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    // Only use console.error for MCP servers
    console.error('Figment MCP Server running...');
  }
}

export { FigmentMCPServer };

export async function startMcpServer() {
  const server = new FigmentMCPServer();
  await server.start().catch(error => {
    console.error('Server failed to start:', error);
    process.exit(1);
  });
}
