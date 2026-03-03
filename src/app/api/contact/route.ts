import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, company, scope } = body;

        // Server-side validation
        if (!name || !email || !scope) {
            return NextResponse.json(
                { error: 'Name, email, and project scope are required.' },
                { status: 400 }
            );
        }

        // Insert into SQLite database (parameterized string stops SQL injection)
        const stmt = db.prepare(`
      INSERT INTO leads (name, email, company, scope)
      VALUES (?, ?, ?, ?)
    `);

        const info = stmt.run(
            name.trim(),
            email.trim(),
            company?.trim() || null,
            scope.trim()
        );

        return NextResponse.json(
            { success: true, leadId: info.lastInsertRowid },
            { status: 201 }
        );
    } catch (error) {
        console.error('Lead Capture Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error while processing lead.' },
            { status: 500 }
        );
    }
}
