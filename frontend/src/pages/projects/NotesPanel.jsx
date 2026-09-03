import { useState } from "react";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../../api/note.api";
import { canManageNotes } from "../../utils/roles";

export default function NotesPanel({ projectId, notes, setNotes, role }) {
  const [error, setError] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const canManage = canManageNotes(role);

  const textareaClass =
    "rounded-lg border border-black/10 dark:border-white/10 bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark placeholder:text-muted px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition resize-none";

  // Refresh notes silently.
  // Notes are owned by ProjectDetails, so switching tabs
  // does not reset or reload the notes state.
  const fetchNotes = async () => {
    try {
      const res = await getNotes(projectId);

      setNotes(res.data.data || []);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load notes");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      await createNote(projectId, content);

      setContent("");

      // Refresh silently.
      await fetchNotes();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add note");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditContent(note.content);
    setError("");
  };

  const handleSaveEdit = async (noteId) => {
    if (!editContent.trim()) return;

    setError("");

    try {
      await updateNote(projectId, noteId, editContent);

      setEditingId(null);
      setEditContent("");

      // Refresh silently.
      await fetchNotes();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update note");
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm("Delete this note?")) return;

    setError("");

    try {
      await deleteNote(projectId, noteId);

      // Refresh silently.
      await fetchNotes();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete note");
    }
  };

  return (
    <div>
      {/* Add note */}
      {canManage && (
        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a note…"
            rows={2}
            className={`flex-1 ${textareaClass}`}
          />

          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 disabled:opacity-60 self-start transition"
          >
            {submitting ? "Adding…" : "Add"}
          </button>
        </form>
      )}

      {/* Error */}
      {error && (
        <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Notes */}
      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note._id}
            className="bg-surface-light dark:bg-surface-dark rounded-xl border border-black/10 dark:border-white/10 p-4"
          >
            {editingId === note._id ? (
              <div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={2}
                  className={`w-full ${textareaClass}`}
                />

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setEditContent("");
                    }}
                    className="px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 text-sm text-muted hover:bg-bg-light dark:hover:bg-bg-dark hover:text-text-light dark:hover:text-text-dark transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveEdit(note._id)}
                    className="px-3 py-1.5 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-text-light dark:text-text-dark whitespace-pre-wrap">
                  {note.content}
                </p>

                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-muted">
                    {note.createdBy?.fullName || note.createdBy?.username} ·{" "}
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>

                  {canManage && (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => startEdit(note)}
                        className="text-xs text-accent hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(note._id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}

        {notes.length === 0 && (
          <p className="text-sm text-muted text-center py-6">No notes yet.</p>
        )}
      </div>
    </div>
  );
}
