'use client';

import { useState, useEffect, useCallback } from 'react';

export interface TypographyConfig {
  heading: string;
  body: string;
  headingWeight: number;
  bodyWeight: number;
  headingLineHeight: number;
  bodyLineHeight: number;
}

interface TypographyPickerProps {
  typography: TypographyConfig;
  onTypographyChange: (type: keyof TypographyConfig, value: string | number) => void;
  setStep: (step: string) => void;
}

// Popular Google Fonts with good readability
const popularFonts = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Poppins',
  'Montserrat',
  'Raleway',
  'Playfair Display',
  'Merriweather',
  'Source Sans Pro',
  'DM Sans',
  'Space Grotesk',
  'Work Sans',
  'Nunito',
  'Rubik',
];

const fontPairings = [
  { heading: 'Playfair Display', body: 'Source Sans Pro', style: 'Elegant' },
  { heading: 'Montserrat', body: 'Open Sans', style: 'Modern' },
  { heading: 'Space Grotesk', body: 'Inter', style: 'Technical' },
  { heading: 'Raleway', body: 'Lato', style: 'Clean' },
  { heading: 'Poppins', body: 'Poppins', style: 'Playful' },
  { heading: 'DM Sans', body: 'DM Sans', style: 'Minimal' },
];

export default function TypographyPicker({
  typography,
  onTypographyChange,
  setStep,
}: TypographyPickerProps) {
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
  const [isLoadingFont, setIsLoadingFont] = useState(false);

  const fontWeights = [400, 500, 600, 700];
  const lineHeights = [1, 1.2, 1.4, 1.5, 1.6, 1.8, 2];

  const loadGoogleFont = useCallback((fontName: string) => {
    if (!fontName || loadedFonts.has(fontName)) return;

    setIsLoadingFont(true);
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
      ' ',
      '+'
    )}:wght@400;500;600;700&display=swap`;
    link.rel = 'stylesheet';
    link.onload = () => {
      setLoadedFonts(prev => new Set(prev).add(fontName));
      setIsLoadingFont(false);
    };
    document.head.appendChild(link);
  }, [loadedFonts]);

  // Load current fonts
  useEffect(() => {
    loadGoogleFont(typography.heading);
    loadGoogleFont(typography.body);
  }, [typography.heading, typography.body, loadGoogleFont]);

  // Preload popular fonts for better UX
  useEffect(() => {
    popularFonts.slice(0, 5).forEach(font => loadGoogleFont(font));
  }, [loadGoogleFont]);

  return (
    <div className="space-y-6">
      {/* Quick Pairings */}
      <div>
        <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-3">Quick Pairings</h4>
        <div className="grid grid-cols-2 gap-2">
          {fontPairings.map(pairing => (
            <button
              key={`${pairing.heading}-${pairing.body}`}
              onClick={() => {
                loadGoogleFont(pairing.heading);
                loadGoogleFont(pairing.body);
                onTypographyChange('heading', pairing.heading);
                onTypographyChange('body', pairing.body);
                onTypographyChange('headingWeight', 700); // Default weight for pairings
                onTypographyChange('bodyWeight', 400); // Default weight for pairings
                onTypographyChange('headingLineHeight', 1.2); // Default line height
                onTypographyChange('bodyLineHeight', 1.5); // Default line height
              }}
              className="p-3 bg-gray-900/50 hover:bg-gray-900 border border-gray-800 rounded-lg transition-all text-left"
            >
              <div className="text-xs text-gray-500 mb-1">{pairing.style}</div>
              <div
                className="text-white font-semibold truncate"
                style={{ fontFamily: `'${pairing.heading}', sans-serif` }}
              >
                {pairing.heading}
              </div>
              <div
                className="text-gray-400 text-sm truncate"
                style={{ fontFamily: `'${pairing.body}', sans-serif` }}
              >
                {pairing.body}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Individual Font Selection */}
      <div className="space-y-4">
        {/* Heading Font */}
        <div>
          <label className="text-gray-300 text-sm uppercase tracking-wider mb-1 block">
            Heading Font
          </label>
          <select
            value={typography.heading}
            onChange={e => {
              const font = e.target.value;
              loadGoogleFont(font);
              onTypographyChange('heading', font);
            }}
            className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white"
            title="Select the font family for headings"
          >
            {popularFonts.map(font => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>
        {/* Heading Font Weight */}
        <div>
          <label className="text-gray-300 text-sm uppercase tracking-wider mb-1 block">
            Heading Weight
          </label>
          <select
            value={typography.headingWeight}
            onChange={e => onTypographyChange('headingWeight', Number(e.target.value))}
            className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white"
            title="Select the font weight for headings"
          >
            {fontWeights.map(weight => (
              <option key={weight} value={weight}>
                {weight}
              </option>
            ))}
          </select>
        </div>
        {/* Heading Line Height */}
        <div>
          <label className="text-gray-300 text-sm uppercase tracking-wider mb-1 block">
            Heading Line Height
          </label>
          <select
            value={typography.headingLineHeight}
            onChange={e => onTypographyChange('headingLineHeight', Number(e.target.value))}
            className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white"
            title="Select the line height for headings"
          >
            {lineHeights.map(height => (
              <option key={height} value={height}>
                {height}
              </option>
            ))}
          </select>
        </div>

        {/* Body Font */}
        <div>
          <label className="text-gray-300 text-sm uppercase tracking-wider mb-1 block">
            Body Font
          </label>
          <select
            value={typography.body}
            onChange={e => {
              const font = e.target.value;
              loadGoogleFont(font);
              onTypographyChange('body', font);
            }}
            className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white"
            title="Select the font family for body text"
          >
            {popularFonts.map(font => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>
        {/* Body Font Weight */}
        <div>
          <label className="text-gray-300 text-sm uppercase tracking-wider mb-1 block">
            Body Weight
          </label>
          <select
            value={typography.bodyWeight}
            onChange={e => onTypographyChange('bodyWeight', Number(e.target.value))}
            className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white"
            title="Select the font weight for body text"
          >
            {fontWeights.map(weight => (
              <option key={weight} value={weight}>
                {weight}
              </option>
            ))}
          </select>
        </div>
        {/* Body Line Height */}
        <div>
          <label className="text-gray-300 text-sm uppercase tracking-wider mb-1 block">
            Body Line Height
          </label>
          <select
            value={typography.bodyLineHeight}
            onChange={e => onTypographyChange('bodyLineHeight', Number(e.target.value))}
            className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white"
            title="Select the line height for body text"
          >
            {lineHeights.map(height => (
              <option key={height} value={height}>
                {height}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Typography Preview */}
      <div className="pt-4 border-t border-gray-800">
        <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-3">Live Preview</h4>
        <div className="space-y-4 p-4 bg-black/30 rounded-lg">
          {isLoadingFont && <div className="text-gray-500 text-sm">Loading fonts...</div>}
          <h1
            className="text-3xl font-bold text-white"
            style={{
              fontFamily: `'${typography.heading}', sans-serif`,
              fontWeight: typography.headingWeight,
              lineHeight: typography.headingLineHeight,
            }}
          >
            The quick brown fox
          </h1>
          <h2
            className="text-xl font-semibold text-white"
            style={{
              fontFamily: `'${typography.heading}', sans-serif`,
              fontWeight: typography.headingWeight,
              lineHeight: typography.headingLineHeight,
            }}
          >
            Jumps over the lazy dog
          </h2>
          <p
            className="text-gray-300 leading-relaxed"
            style={{
              fontFamily: `'${typography.body}', sans-serif`,
              fontWeight: typography.bodyWeight,
              lineHeight: typography.bodyLineHeight,
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation.
          </p>
          <p
            className="text-sm text-gray-400"
            style={{
              fontFamily: `'${typography.body}', sans-serif`,
              fontWeight: typography.bodyWeight,
              lineHeight: typography.bodyLineHeight,
            }}
          >
            The quick brown fox jumps over the lazy dog. 0123456789 !@#$%^&*()
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          onClick={() => setStep('color')}
        >
          Back
        </button>
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          onClick={() => setStep('components')}
        >
          Next
        </button>
      </div>
    </div>
  );
}
