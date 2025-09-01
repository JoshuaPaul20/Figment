'use client';

import { useState } from 'react';
import type { TypographyConfig } from './TypographyPicker';
import type { ComponentPatterns, InputStates, CardVariants } from 'figment-mcp/types';
import { getContrastColor } from '../utils/colors';

interface ComponentPreviewProps {
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
  };
  typography?: TypographyConfig;
  componentStyles?: ComponentPatterns; // Added componentStyles prop
}

export default function ComponentPreview({
  colors,
  typography,
  componentStyles,
}: ComponentPreviewProps) {
  const [previewColor, setPreviewColor] = useState<keyof typeof colors>('primary');

  const fonts = typography || {
    heading: 'Inter',
    body: 'Inter',
    headingWeight: 700,
    bodyWeight: 400,
    headingLineHeight: 1.2,
    bodyLineHeight: 1.5,
  };

  const defaultComponentStyles: ComponentPatterns = {
    button: {
      base: {
        padding: '10px 20px',
        borderRadius: '5px',
        fontWeight: '600',
        transition: 'background-color 0.2s ease-in-out',
      },
      variants: {
        primary: {
          backgroundColor: colors.primary,
          textColor: getContrastColor(colors.primary),
          hoverBackgroundColor: colors.primary,
        },
        secondary: {
          backgroundColor: colors.secondary,
          textColor: getContrastColor(colors.secondary),
          hoverBackgroundColor: colors.secondary,
        },
        outline: {
          borderColor: colors.primary,
          textColor: colors.primary,
          hoverBackgroundColor: colors.primary,
        },
        ghost: {
          textColor: colors.primary,
          hoverBackgroundColor: colors.primary,
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
          borderColor: colors.primary,
          boxShadow: `0 0 0 2px ${colors.primary}80`,
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

  const currentComponentStyles = componentStyles || defaultComponentStyles;

  const previewBg = colors[previewColor] ?? '#ffffff';
  const previewText = getContrastColor(previewBg);
  const cardBg = getContrastColor(previewBg) === '#000000' ? '#ffffff' : '#1a202c'; // White or dark gray based on contrast
  const cardText = getContrastColor(cardBg);

  // Helper to merge styles
  const getButtonStyle = (variant: string) => {
    if (!currentComponentStyles.button) {
      return {}; // Return empty object if button styles are undefined
    }
    const base = currentComponentStyles.button.base || {};
    const variantStyles = currentComponentStyles.button.variants?.[variant as keyof typeof currentComponentStyles.button.variants] || {};
    return { ...base, ...variantStyles };
  };

  const getInputStyle = (state: keyof InputStates) => {
    if (!currentComponentStyles.input) {
      return {}; // Return empty object if input styles are undefined
    }
    const base = currentComponentStyles.input.base || {};
    const stateStyles = currentComponentStyles.input.states?.[state] || {};
    return { ...base, ...stateStyles };
  };

  const getCardStyle = (variant: keyof CardVariants) => {
    if (!currentComponentStyles.card) {
      return {}; // Return empty object if card styles are undefined
    }
    const base = currentComponentStyles.card.base || {};
    const variantStyles = currentComponentStyles.card.variants?.[variant] || {};
    return { ...base, ...variantStyles };
  };

  return (
    <div
      className="space-y-6 p-6 rounded-xl shadow-lg"
      style={{ backgroundColor: previewBg, color: previewText }}
    >
      <div className="flex justify-center mb-4 gap-2">
        <button
          onClick={() => setPreviewColor('primary')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            previewColor === 'primary'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Primary BG
        </button>
        <button
          onClick={() => setPreviewColor('secondary')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            previewColor === 'secondary'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Secondary BG
        </button>
        {colors.accent && (
          <button
            onClick={() => setPreviewColor('accent')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              previewColor === 'accent'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Accent BG
          </button>
        )}
      </div>

      {/* Buttons with typography and component styles */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider" style={{ color: previewText }}>
          Buttons
        </h4>
        <div className="flex flex-wrap gap-3">
          <button
            className="font-medium transition-all hover:opacity-90 shadow-lg"
            style={{
              ...getButtonStyle('primary'),
              fontFamily: `'${fonts.body}', sans-serif`,
              fontWeight: fonts.bodyWeight,
              lineHeight: fonts.bodyLineHeight,
            }}
          >
            Primary Button
          </button>
          <button
            className="font-medium transition-all hover:opacity-90 shadow-lg"
            style={{
              ...getButtonStyle('secondary'),
              fontFamily: `'${fonts.body}', sans-serif`,
              fontWeight: fonts.bodyWeight,
              lineHeight: fonts.bodyLineHeight,
            }}
          >
            Secondary
          </button>
          <button
            className="font-medium transition-all hover:opacity-90 shadow-lg border"
            style={{
              ...getButtonStyle('outline'),
              fontFamily: `'${fonts.body}', sans-serif`,
              fontWeight: fonts.bodyWeight,
              lineHeight: fonts.bodyLineHeight,
            }}
          >
            Outline Button
          </button>
          <button
            className="font-medium transition-all hover:opacity-90"
            style={{
              ...getButtonStyle('ghost'),
              fontFamily: `'${fonts.body}', sans-serif`,
              fontWeight: fonts.bodyWeight,
              lineHeight: fonts.bodyLineHeight,
            }}
          >
            Ghost Button
          </button>
        </div>
      </div>

      {/* Input Field with component styles */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider" style={{ color: previewText }}>
          Input Field
        </h4>
        <input
          type="text"
          placeholder="Enter text..."
          className="w-full transition-all focus:outline-none focus:ring-2"
          style={{
            ...getInputStyle('default'),
            fontFamily: `'${fonts.body}', sans-serif`,
            fontWeight: fonts.bodyWeight,
            lineHeight: fonts.bodyLineHeight,
          }}
        />
        <input
          type="text"
          placeholder="Disabled input..."
          disabled
          className="w-full cursor-not-allowed opacity-60"
          style={{
            ...getInputStyle('default'), // Apply default styles for disabled as well
            fontFamily: `'${fonts.body}', sans-serif`,
            fontWeight: fonts.bodyWeight,
            lineHeight: fonts.bodyLineHeight,
          }}
        />
      </div>

      {/* Color Swatches */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider" style={{ color: previewText }}>
          Color Swatches
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-full border-2"
              style={{
                backgroundColor: colors.primary,
                borderColor: getContrastColor(previewBg) === '#000000' ? '#e2e8f0' : '#4a5568',
              }}
            />
            <span className="text-xs mt-2" style={{ color: previewText }}>
              Primary
            </span>
            <span className="text-xs" style={{ color: previewText }}>
              {colors.primary}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-full border-2"
              style={{
                backgroundColor: colors.secondary,
                borderColor: getContrastColor(previewBg) === '#000000' ? '#e2e8f0' : '#4a5568',
              }}
            />
            <span className="text-xs mt-2" style={{ color: previewText }}>
              Secondary
            </span>
            <span className="text-xs" style={{ color: previewText }}>
              {colors.secondary}
            </span>
          </div>
          {colors.accent && (
            <div className="flex flex-col items-center">
              <div
                className="w-16 h-16 rounded-full border-2"
                style={{
                  backgroundColor: colors.accent,
                  borderColor:
                    getContrastColor(previewBg) === '#000000' ? '#e2e8f0' : '#4a5568',
                }}
              />
              <span className="text-xs mt-2" style={{ color: previewText }}>
                Accent
              </span>
              <span className="text-xs" style={{ color: previewText }}>
                {colors.accent}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Cards with typography and component styles */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider" style={{ color: previewText }}>
          Card Component
        </h4>
        <div
          className="p-6"
          style={{
            ...getCardStyle('default'),
            backgroundColor: cardBg,
            borderColor: getContrastColor(previewBg) === '#000000' ? '#e2e8f0' : '#4a5568',
          }}
        >
          <h3
            className="text-lg font-semibold mb-2"
            style={{
              fontFamily: `'${fonts.heading}', sans-serif`,
              fontWeight: fonts.headingWeight,
              lineHeight: fonts.headingLineHeight,
              color: previewText,
            }}
          >
            Card Title
          </h3>
          <p
            className="text-sm mb-4"
            style={{
              fontFamily: `'${fonts.body}', sans-serif`,
              fontWeight: fonts.bodyWeight,
              lineHeight: fonts.bodyLineHeight,
              color: cardText,
            }}
          >
            This is how your cards will look with your brand colors and typography.
          </p>
          <button
            className="text-sm font-medium"
            style={{
              color: colors.primary,
              fontFamily: `'${fonts.body}', sans-serif`,
              fontWeight: fonts.bodyWeight,
              lineHeight: fonts.bodyLineHeight,
            }}
          >
            Learn more →
          </button>
        </div>
      </div>
    </div>
  );
}
