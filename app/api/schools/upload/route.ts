import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('image') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed!' }, { status: 400 });
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size should be less than 5MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const uniqueName = `school-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.name)}`;
    const filePath = path.join(process.cwd(), 'public', 'schoolImages', uniqueName);

    // Write file
    await writeFile(filePath, buffer);
    
    const imageUrl = `/schoolImages/${uniqueName}`;

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      imageUrl: imageUrl,
      filename: uniqueName,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}