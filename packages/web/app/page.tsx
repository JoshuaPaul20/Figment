'use client';

import Image from 'next/image';

import { useState } from 'react';
import ColorPicker from '../components/ColorPicker';
import TypographyPicker from '../components/TypographyPicker';
import ComponentPreview from '../components/ComponentPreview';
import type { BrandColors } from '../components/ColorPicker';
import type { TypographyConfig } from '../components/TypographyPicker';
import type { ComponentPatternSchema } from 'figment-mcp/types';
import { z } from 'zod';
import { Figma } from 'lucide-react'; // Added Figma import
import { getContrastColor } from '../utils/colors';
import { parseFigmaTokens } from '../utils/figma-tokens';

const DEFAULT_COLORS: BrandColors = {
  primary: '#6B7280', // Neutral gray
  secondary: '#9CA3AF',
  accent: '#D1D5DB',
};

const DEFAULT_TYPOGRAPHY: TypographyConfig = {
  heading: 'Inter',
  body: 'Inter',
  headingWeight: 700,
  bodyWeight: 400,
  headingLineHeight: 1.2,
  bodyLineHeight: 1.5,
};

const DEFAULT_COMPONENT_STYLES: z.infer<typeof ComponentPatternSchema> = {
  button: {
    base: {
      padding: '10px 20px',
      borderRadius: '5px',
      fontWeight: '600',
      transition: 'background-color 0.2s ease-in-out',
    },
    variants: {
      primary: {
        backgroundColor: '#3B82F6',
        textColor: '#FFFFFF',
        hoverBackgroundColor: '#2563EB',
      },
      secondary: {
        backgroundColor: '#64748B',
        textColor: '#FFFFFF',
        hoverBackgroundColor: '#4B5563',
      },
      outline: {
        borderColor: '#3B82F6',
        textColor: '#3B82F6',
        hoverBackgroundColor: '#DBEAFE',
      },
    },
  },
  input: {
    base: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #D1D5DB',
    },
    states: {
      default: {
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
      },
      focus: {
        borderColor: '#3B82F6',
        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
      },
      error: {
        borderColor: '#EF4444',
        textColor: '#EF4444',
      },
    },
  },
  card: {
    base: {
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    variants: {
      default: {
        border: '1px solid #E5E7EB',
      },
      elevated: {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      },
    },
  },
};

export default function Web() {
  const [step, setStep] = useState('color'); // 'color', 'typography', or 'components'
  const [colors, setColors] = useState<BrandColors>(DEFAULT_COLORS);
  const [typography, setTypography] = useState<TypographyConfig>(DEFAULT_TYPOGRAPHY);
  const [componentStyles, setComponentStyles] = useState<z.infer<typeof ComponentPatternSchema>>(
    DEFAULT_COMPONENT_STYLES
  );
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [importedFileName, setImportedFileName] = useState<string | null>(null);

  const handleColorChange = (type: keyof BrandColors, color: string) => {
    const newColors = {
      ...colors,
      [type]: color,
    };
    setColors(newColors);

    // Also update the component styles with the new colors
    setComponentStyles(prevStyles => ({
      ...prevStyles,
      button: {
        ...prevStyles.button,
        variants: {
          ...prevStyles.button?.variants,
          primary: {
            ...prevStyles.button?.variants?.primary,
            backgroundColor: newColors.primary,
            textColor: getContrastColor(newColors.primary),
            hoverBackgroundColor: newColors.primary,
          },
          secondary: {
            ...prevStyles.button?.variants?.secondary,
            backgroundColor: newColors.secondary,
            textColor: getContrastColor(newColors.secondary),
            hoverBackgroundColor: newColors.secondary,
          },
          outline: {
            ...prevStyles.button?.variants?.outline,
            borderColor: newColors.primary,
            textColor: newColors.primary,
            hoverBackgroundColor: newColors.primary,
          },
        },
      },
    }));
  };

  const handleTypographyChange = (type: keyof TypographyConfig, value: string | number) => {
    setTypography(prevTypography => ({
      ...prevTypography,
      [type]: value,
    }));
  };

  const handleComponentStyleChange = (
    component: keyof z.infer<typeof ComponentPatternSchema>,
    styleType: string,
    value: string | number | object
  ) => {
    setComponentStyles(prevStyles => ({
      ...prevStyles,
      [component]: {
        ...prevStyles[component],
        [styleType]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const response = await fetch('/api/save-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ colors, typography, componentStyles }),
      });

      if (response.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000); // Reset status after 3 seconds
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Failed to save brand config:', error);
      setSaveStatus('error');
    }
  };

  const handleReset = () => {
    setColors(DEFAULT_COLORS);
    setTypography(DEFAULT_TYPOGRAPHY);
    setComponentStyles(DEFAULT_COMPONENT_STYLES);
    setStep('color');
    setSaveStatus('idle'); // Reset save status on reset
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target?.result as string);

        // Check if it's a Figma token file
        if (importedConfig.colors && importedConfig.colors.primary && importedConfig.colors.primary.value) {
          const { colors, typography: importedTypography /*, componentStyles */ } = parseFigmaTokens(importedConfig);
          setColors(colors);

          const transformedTypography: TypographyConfig = {
            heading: importedTypography.fontFamily.heading,
            body: importedTypography.fontFamily.body,
            headingWeight: importedTypography.fontWeight?.bold ?? 700,
            bodyWeight: importedTypography.fontWeight?.normal ?? 400,
            headingLineHeight: importedTypography.lineHeight?.tight ?? 1.2,
            bodyLineHeight: importedTypography.lineHeight?.normal ?? 1.5,
          };
          setTypography(transformedTypography);
          // We don't set componentStyles from figma tokens yet
          setSaveStatus('idle');
        } else if (importedConfig.colors && importedConfig.typography) {
          // Handle old Figment format
          setColors(importedConfig.colors);
          setTypography(importedConfig.typography);
          if (importedConfig.componentStyles) {
            setComponentStyles(importedConfig.componentStyles);
          }
          setSaveStatus('idle');
        } else {
          alert('Invalid brand guide file. Missing required sections.');
        }
      } catch (error) {
        alert('Failed to parse brand guide file. Please ensure it is valid JSON.');
        console.error('Error parsing imported file:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <main className="min-h-screen p-8 pb-24 text-white" style={{ backgroundColor: '#1e1e1e' }}>
      <header className="mb-8 flex justify-between items-center">
        <Image src="/figment.png" alt="Figment Logo" width={80} height={80} />
        <div className="flex space-x-4">
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            onClick={handleReset}
            title="Reset all brand guide settings to default values"
          >
            Reset
          </button>
          <input
            type="file"
            id="import-file"
            className="hidden"
            accept=".json"
            onChange={handleImport}
          />
          <label
            htmlFor="import-file"
            className="bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors cursor-pointer flex items-center space-x-2"
            title="Import brand guide from a JSON file, including Figma design tokens"
          >
            <Figma size={20} /> {/* Replaced SVG with Lucide Figma icon */}
            {importedFileName ? `Importing: ${importedFileName}` : 'Import'}
          </label>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            title="Save your current brand guide settings"
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Save Brand Guide'}
          </button>
        </div>
      </header>

      {saveStatus === 'saved' && (
        <div className="bg-green-500 text-white p-3 rounded-lg mb-4 text-center">
          Brand guide saved successfully!
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-center">
          Failed to save brand guide. Please try again.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Left Column: Controls */}
        <div className="space-y-8">
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded-lg font-semibold ${
                step === 'color' ? 'bg-blue-600' : 'bg-gray-700'
              } text-white`}
              onClick={() => setStep('color')}
              title="Define your brand's color palette"
            >
              Colors
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold ${
                step === 'typography' ? 'bg-blue-600' : 'bg-gray-700'
              } text-white`}
              onClick={() => setStep('typography')}
              title="Define your brand's typography settings"
            >
              Typography
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold ${
                step === 'components' ? 'bg-blue-600' : 'bg-gray-700'
              } text-white`}
              onClick={() => setStep('components')}
              title="Define styles for common UI components"
            >
              Components
            </button>
          </div>

          {step === 'color' && (
            <ColorPicker
              colors={colors}
              onColorChange={handleColorChange}
              step={step}
              setStep={setStep}
            />
          )}
          {step === 'typography' && (
            <TypographyPicker
              typography={typography}
              onTypographyChange={handleTypographyChange}
              setStep={setStep}
            />
          )}

          {step === 'components' && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Component Styles</h2>

              {/* Button Styles */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Button</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1">Padding</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={componentStyles.button?.base?.padding || ''}
                      onChange={e =>
                        handleComponentStyleChange('button', 'base', {
                          ...componentStyles.button?.base,
                          padding: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1">Border Radius</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={componentStyles.button?.base?.borderRadius || ''}
                      onChange={e =>
                        handleComponentStyleChange('button', 'base', {
                          ...componentStyles.button?.base,
                          borderRadius: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1">Font Weight</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={componentStyles.button?.base?.fontWeight || ''}
                      onChange={e =>
                        handleComponentStyleChange('button', 'base', {
                          ...componentStyles.button?.base,
                          fontWeight: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1">Transition</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={componentStyles.button?.base?.transition || ''}
                      onChange={e =>
                        handleComponentStyleChange('button', 'base', {
                          ...componentStyles.button?.base,
                          transition: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Input Styles */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Input</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1">Padding</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={componentStyles.input?.base?.padding || ''}
                      onChange={e =>
                        handleComponentStyleChange('input', 'base', {
                          ...componentStyles.input?.base,
                          padding: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1">Border Radius</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={componentStyles.input?.base?.borderRadius || ''}
                      onChange={e =>
                        handleComponentStyleChange('input', 'base', {
                          ...componentStyles.input?.base,
                          borderRadius: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1">Border</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={componentStyles.input?.base?.border || ''}
                      onChange={e =>
                        handleComponentStyleChange('input', 'base', {
                          ...componentStyles.input?.base,
                          border: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Card Styles */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Card</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1">Padding</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={componentStyles.card?.base?.padding || ''}
                      onChange={e =>
                        handleComponentStyleChange('card', 'base', {
                          ...componentStyles.card?.base,
                          padding: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1">Border Radius</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={componentStyles.card?.base?.borderRadius || ''}
                      onChange={e =>
                        handleComponentStyleChange('card', 'base', {
                          ...componentStyles.card?.base,
                          borderRadius: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1">Background Color</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={componentStyles.card?.base?.backgroundColor || ''}
                      onChange={e =>
                        handleComponentStyleChange('card', 'base', {
                          ...componentStyles.card?.base,
                          backgroundColor: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1">Box Shadow</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={componentStyles.card?.base?.boxShadow || ''}
                      onChange={e =>
                        handleComponentStyleChange('card', 'base', {
                          ...componentStyles.card?.base,
                          boxShadow: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Preview */}
        <div className="lg:sticky top-8">
          <ComponentPreview
            colors={colors}
            typography={typography}
            componentStyles={componentStyles}
          />
        </div>
      </div>
    </main>
  );
}
