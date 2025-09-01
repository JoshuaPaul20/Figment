'use client';

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { hexToRgb, rgbToHex, hexToHsl, hslToHex } from '../utils/colors';

export interface BrandColors {
  primary: string;
  secondary: string;
  accent?: string;
}

interface ColorPickerProps {
  colors: BrandColors;
  onColorChange: (type: keyof BrandColors, color: string) => void;
  step: string;
  setStep: (step: string) => void;
}

export default function ColorPicker({ colors, onColorChange, step, setStep }: ColorPickerProps) {
  const [colorFormat, setColorFormat] = useState<Record<keyof BrandColors, 'hex' | 'rgb' | 'hsl'>>({
    primary: 'hex',
    secondary: 'hex',
    accent: 'hex',
  });

  const colorTypes: Array<{ type: keyof BrandColors; label: string }> = [
    { type: 'primary', label: 'Primary' },
    { type: 'secondary', label: 'Secondary' },
    { type: 'accent', label: 'Accent (Optional)' },
  ];

  const getColorValue = (type: keyof BrandColors) => {
    const hex = colors[type];
    if (!hex) return '';
    switch (colorFormat[type]) {
      case 'rgb': {
        const rgb = hexToRgb(hex);
        return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '';
      }
      case 'hsl': {
        const hsl = hexToHsl(hex);
        return hsl ? `${hsl.h}, ${hsl.s}%, ${hsl.l}%` : '';
      }
      case 'hex':
      default:
        return hex;
    }
  };

  const handleInputChange = (type: keyof BrandColors, value: string) => {
    let newHex = colors[type] || '';
    switch (colorFormat[type]) {
      case 'rgb': {
        const rgbParts = value.split(',').map(Number);
        if (rgbParts.length === 3 && rgbParts.every(p => !isNaN(p) && p >= 0 && p <= 255)) {
          newHex = rgbToHex(rgbParts[0], rgbParts[1], rgbParts[2]);
        }
        break;
      }
      case 'hsl': {
        const hslParts = value.replace(/%/g, '').split(',').map(Number);
        if (hslParts.length === 3 && hslParts.every(p => !isNaN(p))) {
          newHex = hslToHex(hslParts[0], hslParts[1], hslParts[2]);
        }
        break;
      }
      case 'hex':
      default:
        // Basic hex validation (starts with # and 3 or 6 hex characters)
        if (/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
          newHex = value;
        }
        break;
    }
    onColorChange(type, newHex);
  };

  return (
    <div className="space-y-8">
      {colorTypes.map(({ type, label }) => (
        <div
          key={type}
          className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl transition-all duration-300"
        >
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            {label}
            <span
              className="w-5 h-5 rounded-full border border-white/30"
              style={{ backgroundColor: colors[type] }}
            />
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="relative">
              <HexColorPicker
                color={colors[type] || ''}
                onChange={color => onColorChange(type, color)}
              />
            </div>
            <div className="flex flex-col gap-4 items-center">
              <div
                className="w-28 h-28 rounded-full border-4 border-white/30 shadow-inner"
                style={{ backgroundColor: colors[type] }}
              />
              <input
                type="text"
                value={getColorValue(type)}
                onChange={e => handleInputChange(type, e.target.value)}
                className="w-28 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white font-mono text-center text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                title={`Enter ${colorFormat[type].toUpperCase()} color value`}
              />
              <div className="flex gap-2 mt-2">
                <button
                  className={`px-3 py-1 rounded-md text-xs font-medium ${
                    colorFormat[type] === 'hex'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => setColorFormat(prev => ({ ...prev, [type]: 'hex' }))}
                  title="Display and input color in HEX format"
                >
                  HEX
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-xs font-medium ${
                    colorFormat[type] === 'rgb'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => setColorFormat(prev => ({ ...prev, [type]: 'rgb' }))}
                  title="Display and input color in RGB format"
                >
                  RGB
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-xs font-medium ${
                    colorFormat[type] === 'hsl'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => setColorFormat(prev => ({ ...prev, [type]: 'hsl' }))}
                  title="Display and input color in HSL format"
                >
                  HSL
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      {step === 'color' && (
        <div className="flex justify-end mt-8">
          <button
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            onClick={() => setStep('typography')}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
