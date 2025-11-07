"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, Edit3, Check } from "lucide-react";
import { Pin } from "@/lib/storage";
import PinItem from "./PinItem";

interface PinnedGridProps {
  pins: Pin[];
  onPinsChange: (pins: Pin[]) => void;
  pinnedSitesOpacity?: number;
}

export default function PinnedGrid({
  pins,
  onPinsChange,
  pinnedSitesOpacity = 85,
}: PinnedGridProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = pins.findIndex((pin) => pin.id === active.id);
      const newIndex = pins.findIndex((pin) => pin.id === over.id);

      onPinsChange(arrayMove(pins, oldIndex, newIndex));
    }
  };

  const handleAddPin = () => {
    if (newTitle.trim() && newUrl.trim()) {
      const newPin: Pin = {
        id: Date.now().toString(),
        title: newTitle,
        url: newUrl.startsWith("http") ? newUrl : `https://${newUrl}`,
      };
      onPinsChange([...pins, newPin]);
      setNewTitle("");
      setNewUrl("");
      setShowAddForm(false);
    }
  };

  const handleRemovePin = (id: string) => {
    onPinsChange(pins.filter((pin) => pin.id !== id));
  };

  const handleEditPin = (id: string, title: string, url: string) => {
    onPinsChange(
      pins.map((pin) => (pin.id === id ? { ...pin, title, url } : pin))
    );
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.5,
          type: "spring",
          stiffness: 100,
        }}
        className="flex items-center justify-between mb-8"
      >
        <h2 className="text-xl font-semibold text-(--text) tracking-wide drop-shadow-lg">
          Pinned Sites
        </h2>
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {editMode && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddForm(!showAddForm)}
                className="glass rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-opacity-70 transition-all text-sm shadow-md"
                aria-label="Add new pin"
              >
                <Plus className="h-4 w-4 drop-shadow-sm" />
                <span className="text-xs font-medium drop-shadow-sm">
                  Add Pin
                </span>
              </motion.button>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditMode(!editMode);
              if (editMode) {
                setShowAddForm(false);
              }
            }}
            className={`glass rounded-xl px-4 py-2 flex items-center gap-2 transition-all text-sm shadow-md ${
              editMode
                ? "bg-(--accent) bg-opacity-20 hover:bg-opacity-30"
                : "hover:bg-opacity-70"
            }`}
            aria-label={editMode ? "Done editing" : "Edit pins"}
          >
            {editMode ? (
              <>
                <Check className="h-4 w-4 drop-shadow-sm" />
                <span className="text-xs font-medium drop-shadow-sm">Done</span>
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4 drop-shadow-sm" />
                <span className="text-xs font-medium drop-shadow-sm">Edit</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: "2rem" }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="glass rounded-2xl p-6 overflow-hidden"
          >
            <h3 className="text-xs font-medium mb-4 text-(--text) tracking-wide uppercase">
              Add New Pin
            </h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="glass rounded-xl px-4 py-3 outline-none text-(--text) placeholder:text-(--text-muted) text-sm focus:ring-1 focus:ring-(--accent) focus:ring-opacity-30 transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleAddPin()}
              />
              <input
                type="url"
                placeholder="URL (https://example.com)"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="glass rounded-xl px-4 py-3 outline-none text-(--text) placeholder:text-(--text-muted) text-sm focus:ring-1 focus:ring-(--accent) focus:ring-opacity-30 transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleAddPin()}
              />
              <div className="flex gap-3 mt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddPin}
                  className="flex-1 bg-(--accent) text-white rounded-xl py-2.5 hover:bg-(--accent-hover) transition-colors text-sm font-light"
                >
                  Add
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowAddForm(false);
                    setNewTitle("");
                    setNewUrl("");
                  }}
                  className="flex-1 glass rounded-xl py-2.5 hover:bg-opacity-70 transition-colors text-sm font-light"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={pins.map((p) => p.id)}
          strategy={rectSortingStrategy}
        >
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {pins.map((pin) => (
              <PinItem
                key={pin.id}
                pin={pin}
                onRemove={handleRemovePin}
                onEdit={handleEditPin}
                editMode={editMode}
                opacity={pinnedSitesOpacity}
              />
            ))}
          </motion.div>
        </SortableContext>
      </DndContext>

      {pins.length === 0 && !showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-(--text-muted)"
        >
          <p className="mb-2 font-medium text-lg tracking-wide">
            No pinned sites yet
          </p>
          <p className="text-sm font-light tracking-wide">
            Click "Add Pin" to get started
          </p>
        </motion.div>
      )}
    </div>
  );
}
