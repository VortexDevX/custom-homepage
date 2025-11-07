"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useDragControls,
  PanInfo,
} from "framer-motion";
import { X, Plus, GripVertical, Check, Filter } from "lucide-react";
import { Note, NotesPosition } from "@/lib/storage";

interface NotesWidgetProps {
  notes: Note[];
  position: NotesPosition;
  visible: boolean;
  onNotesChange: (notes: Note[]) => void;
  onPositionChange: (position: NotesPosition) => void;
  onClose: () => void;
}

const labelColors = [
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Yellow", value: "#eab308" },
  { name: "Green", value: "#22c55e" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
];

export default function NotesWidget({
  notes,
  position,
  visible,
  onNotesChange,
  onPositionChange,
  onClose,
}: NotesWidgetProps) {
  const [newNote, setNewNote] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<string | undefined>();
  const [filterLabel, setFilterLabel] = useState<string | null>(null);
  const dragControls = useDragControls();

  const handleDragEnd = (event: any, info: PanInfo) => {
    onPositionChange({
      x: position.x + info.offset.x,
      y: position.y + info.offset.y,
    });
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote,
        createdAt: Date.now(),
        label: selectedLabel,
        color: labelColors.find((c) => c.name === selectedLabel)?.value,
        completed: false,
      };
      onNotesChange([...notes, note]);
      setNewNote("");
      setSelectedLabel(undefined);
    }
  };

  const handleToggleComplete = (id: string) => {
    onNotesChange(
      notes.map((note) =>
        note.id === id ? { ...note, completed: !note.completed } : note
      )
    );
  };

  const handleRemoveNote = (id: string) => {
    onNotesChange(notes.filter((note) => note.id !== id));
  };

  const filteredNotes = filterLabel
    ? notes.filter((note) => note.label === filterLabel)
    : notes;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          drag
          dragControls={dragControls}
          dragMomentum={false}
          dragElastic={0}
          onDragEnd={handleDragEnd}
          initial={{
            opacity: 0,
            scale: 0.9,
            x: position.x,
            y: position.y - 20,
          }}
          animate={{ opacity: 1, scale: 1, x: position.x, y: position.y }}
          exit={{ opacity: 0, scale: 0.9, y: position.y - 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed glass rounded-2xl shadow-2xl w-80 max-h-[500px] flex flex-col z-50"
          style={{
            left: 0,
            top: 0,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 border-b border-(--panel-border) cursor-move"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-(--text-muted)" />
              <h3 className="font-light text-(--text) tracking-wide">Notes</h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1 hover:bg-red-500 hover:bg-opacity-10 rounded-lg transition-all"
              aria-label="Close notes"
            >
              <X className="h-4 w-4 text-red-500" />
            </motion.button>
          </div>

          {/* Filter */}
          <div className="p-3 border-b border-(--panel-border)">
            <div className="flex items-center gap-2 overflow-x-auto">
              <Filter className="h-3.5 w-3.5 text-(--text-muted) shrink-0" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterLabel(null)}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors font-light ${
                  filterLabel === null
                    ? "bg-(--accent) text-white"
                    : "glass text-(--text-muted)"
                }`}
              >
                All
              </motion.button>
              {labelColors.map((color) => (
                <motion.button
                  key={color.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterLabel(color.name)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-colors shrink-0 font-light ${
                    filterLabel === color.name
                      ? "text-white"
                      : "glass text-(--text-muted)"
                  }`}
                  style={{
                    backgroundColor:
                      filterLabel === color.name ? color.value : undefined,
                  }}
                >
                  {color.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <AnimatePresence>
              {filteredNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-xl p-3 group hover:shadow-sm transition-shadow"
                  style={{
                    borderLeft: note.color
                      ? `3px solid ${note.color}`
                      : undefined,
                  }}
                >
                  <div className="flex items-start gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleComplete(note.id)}
                      className={`mt-0.5 shrink-0 h-4 w-4 rounded border-2 flex items-center justify-center transition-colors ${
                        note.completed
                          ? "bg-(--accent) border-(--accent)"
                          : "border-(--text-muted)"
                      }`}
                      aria-label={
                        note.completed
                          ? "Mark as incomplete"
                          : "Mark as complete"
                      }
                    >
                      <AnimatePresence>
                        {note.completed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Check className="h-3 w-3 text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    <p
                      className={`flex-1 text-xs font-light ${
                        note.completed
                          ? "line-through text-(--text-muted)"
                          : "text-(--text)"
                      }`}
                    >
                      {note.content}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveNote(note.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500 hover:bg-opacity-10 rounded-lg transition-all"
                      aria-label="Remove note"
                    >
                      <X className="h-3.5 w-3.5 text-red-500" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredNotes.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-xs text-(--text-muted) py-8 font-light"
              >
                No notes {filterLabel && `with label "${filterLabel}"`}
              </motion.p>
            )}
          </div>

          {/* Add Note */}
          <div className="p-4 border-t border-(--panel-border)">
            <div className="flex gap-2 mb-3">
              {labelColors.map((color) => (
                <motion.button
                  key={color.name}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() =>
                    setSelectedLabel(
                      selectedLabel === color.name ? undefined : color.name
                    )
                  }
                  className={`h-6 w-6 rounded-full transition-all ${
                    selectedLabel === color.name
                      ? "ring-2 ring-offset-2 ring-(--accent)"
                      : ""
                  }`}
                  style={{ backgroundColor: color.value }}
                  aria-label={`Select ${color.name} label`}
                  title={color.name}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                placeholder="Add a note..."
                className="flex-1 glass rounded-xl px-3 py-2 outline-none text-xs text-(--text) placeholder:text-(--text-muted) font-light focus:ring-1 focus:ring-(--accent) focus:ring-opacity-30 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddNote}
                className="bg-(--accent) text-white rounded-xl px-4 py-2 hover:bg-(--accent-hover) transition-colors"
                aria-label="Add note"
              >
                <Plus className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
