import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import type { ResultSetHeader, RowDataPacket } from 'mysql2'; // ✅ import types

export async function GET() {
  try {
    const connection = await connectDB();
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM schools ORDER BY created_at DESC'
    );
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const connection = await connectDB();
    const body = await request.json();
    const { name, address, city, state, contact, email_id, image } = body;

    // Validation
    if (!name || !address || !city || !state || !contact || !email_id) {
      return NextResponse.json(
        { error: 'All fields except image are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_id)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Contact validation
    const contactStr = contact.toString();
    if (contactStr.length !== 10 || !/^\d{10}$/.test(contactStr)) {
      return NextResponse.json(
        { error: 'Contact must be a 10-digit number' },
        { status: 400 }
      );
    }

    // Insert into database
    const [result] = await connection.execute<ResultSetHeader>(
      'INSERT INTO schools (name, address, city, state, contact, email_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, address, city, state, contact, email_id, image || null]
    );

    return NextResponse.json({
      message: 'School added successfully',
      id: result.insertId,
      school: {
        id: result.insertId,
        name, address, city, state, contact, email_id, image
      }
    }, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
