"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ExternalLink, X } from "lucide-react";
import { Pin } from "@/lib/storage";
import Image from "next/image";

interface PinItemProps {
  pin: Pin;
  onRemove: (id: string) => void;
  onEdit: (id: string, title: string, url: string) => void;
  editMode: boolean;
  opacity?: number;
}

export default function PinItem({
  pin,
  onRemove,
  onEdit,
  editMode,
  opacity = 85,
}: PinItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: pin.id });

  const combinedStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Apply opacity only to background, not content
  const glassStyle = {
    "--glass-opacity": (opacity / 100).toString(),
  } as React.CSSProperties;

  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  };

  const getShortTitle = (title: string) => {
    return title.length > 20 ? title.substring(0, 20) + "..." : title;
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={combinedStyle}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{
        opacity: 1,
        scale: isDragging ? 1.05 : editMode ? 1 : 1.05,
        y: 0,
        boxShadow: isDragging
          ? "0 10px 30px rgba(0, 0, 0, 0.3)"
          : "0 2px 8px rgba(0, 0, 0, 0.06)",
      }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="rounded-2xl group"
    >
      <div className="relative rounded-2xl p-5 hover:shadow-xl transition-shadow duration-300 h-full overflow-hidden">
        {/* Background layer with glass effect and opacity */}
        <div
          className="absolute inset-0 glass rounded-2xl"
          style={{ opacity: opacity / 100 }}
        />

        {/* Content layer - always 100% opacity */}
        <div className="relative z-10">
          <AnimatePresence>
            {editMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-start justify-between mb-4"
              >
                <motion.button
                  {...attributes}
                  {...listeners}
                  whileHover={{ scale: 1.1 }}
                  className="cursor-grab active:cursor-grabbing p-1 transition-opacity"
                  aria-label="Drag to reorder"
                >
                  <GripVertical className="h-3.5 w-3.5 text-(--text-muted)" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onRemove(pin.id)}
                  className="p-1 hover:bg-red-500 hover:bg-opacity-10 rounded-lg transition-all"
                  aria-label={`Remove ${pin.title}`}
                >
                  <X className="h-3.5 w-3.5 text-red-500" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <a
            href={pin.url}
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 text-center group"
          >
            {pin.icon || getFavicon(pin.url) ? (
              <motion.div
                whileHover={editMode ? {} : { scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="h-12 w-12 rounded-xl overflow-hidden shadow-md relative"
              >
                <Image
                  src={pin.icon || getFavicon(pin.url)!}
                  alt={`${pin.title} icon`}
                  fill
                  sizes="48px"
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.parentElement!.innerHTML =
                      '<div class="h-full w-full bg-(--accent) bg-opacity-20 flex items-center justify-center"><ExternalLink class="h-5 w-5 text-(--accent) drop-shadow-sm" /></div>';
                  }}
                  quality={75}
                  loading="lazy"
                />
              </motion.div>
            ) : (
              <motion.div
                whileHover={editMode ? {} : { scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="h-12 w-12 rounded-xl bg-(--accent) bg-opacity-20 flex items-center justify-center shadow-md"
              >
                <ExternalLink className="h-5 w-5 text-(--accent) drop-shadow-sm" />
              </motion.div>
            )}
            <h3
              className="text-sm font-medium text-(--text) line-clamp-2 tracking-wide drop-shadow-md"
              title={pin.title}
            >
              {getShortTitle(pin.title)}
            </h3>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
