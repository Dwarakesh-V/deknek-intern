'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useIsLogedIn } from '../admin/hooks/useIsLogedIn'; // Assuming this path is still correct!
import ReactMarkdown from 'react-markdown';

type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
};

export default function Home() {
  useIsLogedIn();

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [title, setTitle] = useState('Untitled Note');
  const [content, setContent] = useState(
    '# Welcome to NoteForge\n\n## Start Writing\n\n- Notes\n- Ideas\n- Markdown\n\n```js\nconsole.log("hello world")\n```'
  );
  const [saved, setSaved] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  // 1. Fetch Notes from Database on Load
  useEffect(() => {
    async function fetchNotes() {
      try {
        const res = await fetch('/api/notes');
        if (!res.ok) return;

        const data: Note[] = await res.json();
        setNotes(data);

        // Auto-load the first note if there is one
        if (data.length > 0) {
          loadNote(data[0]);
        }
      } catch (error) {
        console.error('Failed to load notes:', error);
      }
    }

    fetchNotes();
  }, []);

  // Update "Last opened" timestamp when a new note is selected or saved
  useEffect(() => {
    setCurrentDate(new Date().toLocaleString());
  }, [saved, selectedId]);

  // Helper to quickly load a note into the editor
  function loadNote(note: Note) {
    setSelectedId(note.id);
    setTitle(note.title);
    setContent(note.content);
  }

  // 2. Create Note in Database
  async function createNote() {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Untitled Note',
          content: '# New Note',
        }),
      });

      if (!res.ok) throw new Error('Failed to create');

      const newNote: Note = await res.json();
      setNotes([newNote, ...notes]);
      loadNote(newNote);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  }

  // 3. Save/Update Note in Database
  async function saveNote() {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedId,
          title,
          content,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Server Error: ${errorData.error || 'Failed to save'}`);
        console.error('Full error:', errorData);
        return;
      }

      const savedNote: Note = await res.json();

      let updated: Note[];
      if (selectedId) {
        updated = notes.map((n) => (n.id === selectedId ? savedNote : n));
      } else {
        updated = [savedNote, ...notes];
        setSelectedId(savedNote.id);
      }

      setNotes(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 1400);
    } catch (error) {
      alert('Network Error: Could not reach the server.');
      console.error('Failed to save note:', error);
    }
  }

  // 4. Delete Note from Database
  async function deleteNote(id: string) {
    try {
      await fetch('/api/notes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const updated = notes.filter((n) => n.id !== id);
      setNotes(updated);

      if (selectedId === id) {
        setSelectedId('');
        setTitle('Untitled Note');
        setContent('');
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  }

  // 5. Local File Download (No DB changes needed here)
  function downloadMarkdown() {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'note'}.md`;
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="images/logo.svg" className="w-10" alt="logo" />
            <div>
              <h1 className="text-lg font-bold">NoteForge</h1>
              <p className="text-xs text-gray-500">Markdown Notes Dashboard</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/">
              <Button variant="outline">Home</Button>
            </Link>

            <Button onClick={() => signOut()}>Logout</Button>
          </div>
        </div>
      </nav>

      {/* Layout */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 lg:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <aside className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Your Notes</h2>
            <Button onClick={createNote}>New</Button>
          </div>

          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => loadNote(note)}
                className={`cursor-pointer rounded-xl border p-3 transition ${
                  selectedId === note.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{note.title}</p>
                    <p className="text-xs text-gray-500">
                      {/* Safe Date Check! */}
                      {note.updatedAt
                        ? new Date(note.updatedAt).toLocaleString()
                        : 'Just now'}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents loading the note when clicking delete
                      deleteNote(note.id);
                    }}
                    className="text-xs text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {notes.length === 0 && (
              <div className="rounded-xl border border-dashed p-4 text-sm text-gray-500">
                No notes yet.
              </div>
            )}
          </div>
        </aside>

        {/* Main */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="w-full">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 text-xl font-semibold outline-none focus:border-blue-500"
              />
              <p className="mt-2 text-xs text-gray-500">
                Last opened: {currentDate}
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={downloadMarkdown}>
                Download .md
              </Button>

              <Button onClick={saveNote}>
                {saved ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>

          {/* Split View */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Editor */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-500">
                Editor
              </h3>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[520px] w-full rounded-2xl border p-4 font-mono text-sm outline-none focus:border-blue-500"
                placeholder="Write markdown here..."
              />
            </div>

            {/* Preview (Using the Tailwind typography plugin 'prose' class) */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-500">
                Live Preview
              </h3>

              <div className="prose max-w-none min-h-[520px] rounded-2xl border bg-gray-50 p-6 overflow-auto">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}