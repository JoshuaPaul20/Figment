import { NextResponse } from 'next/server';
import { BrandContextManager } from 'figment-mcp/brand-context';
import { BrandContextSchema } from 'figment-mcp/types';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const brandConfig = await request.json();

    // Transform and validate the incoming data
    const transformedConfig = {
      name: 'Brand',
      version: '1.0.0',
      colors: brandConfig.colors,
      typography: {
        fontFamily: {
          heading: brandConfig.typography.heading,
          body: brandConfig.typography.body,
        },
        fontSize: {
          base: '16px',
        },
        fontWeight: {
          normal: brandConfig.typography.bodyWeight,
          bold: brandConfig.typography.headingWeight,
        },
        lineHeight: {
            normal: brandConfig.typography.bodyLineHeight,
            tight: brandConfig.typography.headingLineHeight,
        }
      },
      spacing: {
        base: 8,
        scale: [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96],
      },
      components: brandConfig.componentStyles,
    };

    const validationResult = BrandContextSchema.safeParse(transformedConfig);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid brand configuration provided.',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const brandManager = new BrandContextManager();
    await brandManager.saveContext(validationResult.data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save brand config:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid brand configuration provided.', details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Failed to save brand configuration.' }, { status: 500 });
  }
}
