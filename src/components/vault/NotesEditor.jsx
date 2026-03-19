"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { FiPlus, FiTrash2, FiSave, FiBold, FiItalic, FiList, FiCheckSquare, FiImage, FiX, FiFileText } from "react-icons/fi";
import toast from "react-hot-toast";

const NOTE_COLORS = [
  { name: "Default", value: "transparent", border: "border-white/10" },
  { name: "Blue", value: "#1e3a5f20", border: "border-blue-500/20" },
  { name: "Purple", value: "#3b1f6e20", border: "border-purple-500/20" },
  { name: "Green", value: "#14532d20", border: "border-green-500/20" },
  { name: "Amber", value: "#78350f20", border: "border-amber-500/20" },
  { name: "Red", value: "#7f1d1d20", border: "border-red-500/20" },
];

export function NotesEditor() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const editorRef = useRef(null);
  const saveTimerRef = useRef(null);

  // Load notes from Firestore
  useEffect(() => {
    if (!user?.uid) return;
    loadNotes();
  }, [user]);

  const loadNotes = async () => {
    try {
      const q = query(
        collection(db, "users", user.uid, "notes"),
        orderBy("updatedAt", "desc")
      );
      const snapshot = await getDocs(q);
      const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setNotes(loaded);
      if (loaded.length > 0 && !activeNote) {
        setActiveNote(loaded[0]);
        // Set content after render
        setTimeout(() => {
          if (editorRef.current) editorRef.current.innerHTML = loaded[0].content || "";
        }, 50);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    try {
      const newNote = {
        title: "Untitled Note",
        content: "",
        color: "transparent",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, "users", user.uid, "notes"), newNote);
      const created = { id: docRef.id, ...newNote, createdAt: new Date(), updatedAt: new Date() };
      setNotes(prev => [created, ...prev]);
      setActiveNote(created);
      if (editorRef.current) editorRef.current.innerHTML = "";
      toast.success("New note created");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create note");
    }
  };

  const deleteNote = async (noteId) => {
    if (!confirm("Delete this note?")) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "notes", noteId));
      const remaining = notes.filter(n => n.id !== noteId);
      setNotes(remaining);
      if (activeNote?.id === noteId) {
        if (remaining.length > 0) {
          setActiveNote(remaining[0]);
          setTimeout(() => {
            if (editorRef.current) editorRef.current.innerHTML = remaining[0].content || "";
          }, 50);
        } else {
          setActiveNote(null);
          if (editorRef.current) editorRef.current.innerHTML = "";
        }
      }
      toast.success("Note deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete note");
    }
  };

  const saveNote = useCallback(async () => {
    if (!activeNote || !editorRef.current) return;
    setSaving(true);
    const content = editorRef.current.innerHTML;
    try {
      await updateDoc(doc(db, "users", user.uid, "notes", activeNote.id), {
        title: activeNote.title,
        content,
        color: activeNote.color || "transparent",
        updatedAt: serverTimestamp()
      });
      setNotes(prev => prev.map(n => n.id === activeNote.id ? { ...n, content, title: activeNote.title, color: activeNote.color } : n));
    } catch (err) {
      console.error(err);
      toast.error("Failed to save note");
    } finally {
      setSaving(false);
    }
  }, [activeNote, user]);

  // Auto-save every 3 seconds when editing
  const handleContentChange = () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveNote();
    }, 3000);
  };

  const selectNote = (note) => {
    // Save current note before switching
    if (activeNote && editorRef.current) {
      saveNote();
    }
    setActiveNote(note);
    setTimeout(() => {
      if (editorRef.current) editorRef.current.innerHTML = note.content || "";
    }, 50);
  };

  // Toolbar commands
  const execCommand = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  };

  const insertCheckbox = () => {
    execCommand("insertHTML", '<div class="flex items-start gap-2 my-1"><input type="checkbox" class="mt-1 accent-blue-500" /><span>Task item</span></div>');
  };

  const insertImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        execCommand("insertHTML", `<img src="${reader.result}" style="max-width:100%;border-radius:12px;margin:8px 0;" />`);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  if (loading) {
    return (
      <GlassCard className="p-6 md:p-8">
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-0 overflow-hidden flex flex-col min-h-[500px] md:h-[650px]">
      <div className="flex flex-1">
        {/* Sidebar — Note List */}
        <div className="w-64 border-r border-white/5 flex flex-col bg-black/30 shrink-0 hidden md:flex">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <FiFileText className="text-blue-400" /> My Notes
            </h3>
            <button
              onClick={createNote}
              className="w-7 h-7 rounded-lg bg-blue-500 hover:bg-blue-400 flex items-center justify-center transition-colors"
            >
              <FiPlus className="text-sm" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {notes.length === 0 && (
              <div className="text-center py-8 text-zinc-500 text-sm">
                <FiFileText className="mx-auto text-2xl mb-2 opacity-50" />
                No notes yet
              </div>
            )}
            {notes.map(note => (
              <button
                key={note.id}
                onClick={() => selectNote(note)}
                className={`w-full text-left p-3 rounded-xl transition-all text-sm group
                  ${activeNote?.id === note.id 
                    ? "bg-white/10 border border-white/10" 
                    : "hover:bg-white/5 border border-transparent"}`}
              >
                <p className="font-medium truncate text-xs">{note.title || "Untitled"}</p>
                <p className="text-[10px] text-zinc-500 mt-1 truncate">
                  {note.updatedAt?.toDate?.() 
                    ? note.updatedAt.toDate().toLocaleDateString() 
                    : new Date(note.updatedAt).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          {activeNote ? (
            <>
              {/* Title & Actions */}
              <div className="p-3 md:p-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                <input
                  type="text"
                  value={activeNote.title || ""}
                  onChange={(e) => setActiveNote(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full sm:flex-1 min-w-0 bg-transparent text-lg font-bold font-mono outline-none text-white placeholder-zinc-600 truncate"
                  placeholder="Note title..."
                />
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
                  {/* Color picker dots */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {NOTE_COLORS.map(c => (
                      <button
                        key={c.name}
                        onClick={() => setActiveNote(prev => ({ ...prev, color: c.value }))}
                        className={`w-5 h-5 md:w-4 md:h-4 rounded-full border transition-transform hover:scale-125
                          ${activeNote.color === c.value ? "ring-2 ring-white/50 scale-110" : ""} ${c.border}`}
                        style={{ background: c.value === "transparent" ? "#27272a" : c.value.replace("20", "60") }}
                        title={c.name}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-auto">
                    <button onClick={() => deleteNote(activeNote.id)} className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors" title="Delete note">
                      <FiTrash2 className="text-sm" />
                    </button>
                    <button onClick={saveNote} disabled={saving} className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50">
                      <FiSave className="text-xs md:text-sm" /> {saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Formatting Toolbar */}
              <div className="px-2 md:px-4 py-2 border-b border-white/5 flex items-center gap-1 overflow-x-auto no-scrollbar bg-black/20 shrink-0">
                <button onClick={() => execCommand("bold")} className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" title="Bold">
                  <FiBold className="text-sm" />
                </button>
                <button onClick={() => execCommand("italic")} className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" title="Italic">
                  <FiItalic className="text-sm" />
                </button>
                <button onClick={() => execCommand("underline")} className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" title="Underline">
                  <span className="text-sm font-medium underline">U</span>
                </button>
                <div className="w-px h-5 bg-white/10 mx-1" />
                <button onClick={() => execCommand("insertUnorderedList")} className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" title="Bullet List">
                  <FiList className="text-sm" />
                </button>
                <button onClick={insertCheckbox} className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" title="Add Checkbox">
                  <FiCheckSquare className="text-sm" />
                </button>
                <div className="w-px h-5 bg-white/10 mx-1" />
                <button onClick={insertImage} className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" title="Insert Image">
                  <FiImage className="text-sm" />
                </button>
                <div className="w-px h-5 bg-white/10 mx-1" />
                <button onClick={() => execCommand("formatBlock", "h2")} className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors text-xs font-bold" title="Heading">
                  H
                </button>
                <button onClick={() => execCommand("strikeThrough")} className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors text-sm line-through" title="Strikethrough">
                  S
                </button>
              </div>

              {/* Content Area */}
              <div
                ref={editorRef}
                contentEditable
                onInput={handleContentChange}
                className="flex-1 p-4 md:p-6 outline-none overflow-y-auto overflow-x-hidden text-sm leading-relaxed text-zinc-200 prose prose-invert break-words max-w-full min-h-[300px] w-full"
                style={{ background: activeNote.color || "transparent" }}
                suppressContentEditableWarning
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <FiFileText className="text-4xl text-zinc-700 mb-4" />
              <h3 className="font-semibold text-lg mb-2">No Note Selected</h3>
              <p className="text-sm text-zinc-500 mb-6">Create a new note or select one from the list</p>
              <button
                onClick={createNote}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium text-sm transition-colors"
              >
                <FiPlus /> Create Note
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile note selector */}
      <div className="md:hidden border-t border-white/5 p-3 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={createNote}
          className="shrink-0 w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center"
        >
          <FiPlus className="text-sm" />
        </button>
        {notes.map(note => (
          <button
            key={note.id}
            onClick={() => selectNote(note)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${activeNote?.id === note.id ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"}`}
          >
            {note.title?.substring(0, 12) || "Untitled"}
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
