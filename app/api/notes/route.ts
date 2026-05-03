import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/app/libs/prismaDb';
import { authOptions } from '@/app/utils/authOptions';

export const dynamic = 'force-dynamic';

// ----------------------------------------------------------------------
// GET: Fetch all notes for the logged-in user
// ----------------------------------------------------------------------
export async function GET() {
  try {
    // Pass authOptions so the server can read the JWT session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch notes specifically tied to this user's ID
    const notes = await prisma.note.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ----------------------------------------------------------------------
// POST: Create or Update a note for the logged-in user
// ----------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { id, title, content } = body;

    // If an ID exists, UPDATE the existing note
    if (id && id.length > 0) {
      const existingNote = await prisma.note.findUnique({ where: { id } });

      // Ensure the user actually owns the note they are trying to edit
      if (!existingNote || existingNote.userId !== user.id) {
        return NextResponse.json({ error: 'Unauthorized to edit this note' }, { status: 403 });
      }

      const updatedNote = await prisma.note.update({
        where: { id },
        data: { title, content },
      });
      return NextResponse.json(updatedNote);
    }

    // Otherwise, CREATE a new note attached to this user
    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        userId: user.id,
      },
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error('Error saving note:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ----------------------------------------------------------------------
// DELETE: Delete a specific note
// ----------------------------------------------------------------------
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Ensure the user owns the note before deleting it
    const existingNote = await prisma.note.findUnique({ where: { id } });
    if (!existingNote || existingNote.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to delete this note' }, { status: 403 });
    }

    await prisma.note.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
