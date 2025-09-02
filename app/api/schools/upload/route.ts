// app/api/schools/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, access } from 'fs/promises';
import path from 'path';

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const fileRaw = form.get('image');

    if (!fileRaw || !(fileRaw instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    const file = fileRaw as File;

    // Basic validations
    if (!file.type || !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File size should be less than 5MB' }, { status: 400 });
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'schoolImages');
    try {
      await access(uploadDir);
    } catch {
      await mkdir(uploadDir, { recursive: true });
    }

    // Build safe filename
    const ext = path.extname(file.name).toLowerCase();
    const rawBase = path.basename(file.name, ext);
    const safeBase = rawBase.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-').slice(0, 50);
    const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
    const safeFilename = `${safeBase || 'upload'}-${uniqueSuffix}${ext || '.jpg'}`;
    const filePath = path.join(uploadDir, safeFilename);

    // Write file to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);

    const imageUrl = `/schoolImages/${safeFilename}`;

    // Optional: If you want to insert the imageUrl into MySQL right away,
    // uncomment the block below and set your DB env vars. (Requires mysql2)
    /*
    import mysql from 'mysql2/promise';
    const conn = await mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    // Example: insert a new school row (adjust columns as needed)
    const [result] = await conn.query(
      'INSERT INTO schools (name, address, city, state, contact, image_path) VALUES (?, ?, ?, ?, ?, ?)',
      [form.get('name') ?? null, form.get('address') ?? null, form.get('city') ?? null, form.get('state') ?? null, form.get('contact') ?? null, imageUrl]
    );
    */

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      imageUrl,
      filename: safeFilename,
    }, { status: 200 });

  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
