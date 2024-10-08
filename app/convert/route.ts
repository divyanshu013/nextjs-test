import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { load } from '@pspdfkit/nodejs';

export async function POST(req: NextRequest) {
  try {
    const { filename } = await req.json();

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const inputPath = path.join(process.cwd(), filename);
    const outputPath = path.join(process.cwd(), `${path.parse(filename).name}.pdf`);

    const sdkKey = process.env.PSPDFKIT_SDK_KEY;

    if (!sdkKey) {
      return NextResponse.json({ error: 'PSPDFKIT_SDK_KEY is not set' }, { status: 500 });
    }

    // Read file
    const fileBuffer = await fs.readFile(inputPath);

    const document = await load({
      document: fileBuffer,
      license: { key: sdkKey, appName: 'www.endorsed.com' }
    });

    const pdfBuffer = await document.exportPDF();

    if (!pdfBuffer) {
      return NextResponse.json({ error: 'PDF conversion failed' }, { status: 500 });
    }

    await fs.writeFile(outputPath, Buffer.from(pdfBuffer));

    // Close the document instance
    document.close();

    return NextResponse.json(
      { success: true, filename: `${path.parse(filename).name}.pdf` },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json({ error: 'PDF conversion failed' }, { status: 500 });
  }
}