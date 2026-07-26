"use client";

import { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

/**
 * Not a mock of the card builder: it is the card builder's actual mechanic,
 * running the same @dnd-kit sortable the product uses. Drag or use the keyboard
 * (tab to a handle, space, arrows, space) and the order really changes.
 */

const ROWS = [
  { id: "header", label: "Header", hint: "Avatar, name, role" },
  { id: "contact", label: "Contact", hint: "Email, phone, location" },
  { id: "socials", label: "Socials", hint: "Four links" },
];

const ACCENTS = ["#2ed3e0", "#7c9cff", "#ff7ab8", "#5fe38a", "#ff9557", "#c6ff4b"];

function Row({ row, index, accent }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: row.id });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : 1,
      }}
      className="relative"
    >
      <div
        className="relative flex items-center gap-3 overflow-hidden rounded-xl border bg-[var(--ink-850)] px-3 py-2.5"
        style={{
          borderColor: isDragging ? `${accent}73` : "var(--line)",
          boxShadow: isDragging ? "0 18px 34px -18px rgba(0,0,0,0.9)" : "none",
        }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[3px] transition-colors duration-200 ease-out"
          style={{ background: accent, opacity: isDragging ? 1 : 0.55 }}
        />
        <button
          type="button"
          className="-m-2 grid h-11 w-11 shrink-0 cursor-grab place-items-center rounded-lg text-[var(--paper-faint)] transition-colors duration-150 hover:text-[var(--paper)] active:cursor-grabbing"
          aria-label={`Reorder ${row.label}. Position ${index + 1} of ${ROWS.length}.`}
          {...attributes}
          {...listeners}
        >
          <GripVertical size={15} strokeWidth={1.75} />
        </button>
        <span className="text-[13px] font-medium text-[var(--paper)]">
          {row.label}
        </span>
        <span className="ml-auto truncate text-[11.5px] text-[var(--paper-faint)]">
          {row.hint}
        </span>
      </div>
    </li>
  );
}

export function BuilderPreview() {
  const [items, setItems] = useState(ROWS);
  const [accent, setAccent] = useState(ACCENTS[0]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setItems((prev) => {
      const from = prev.findIndex((r) => r.id === active.id);
      const to = prev.findIndex((r) => r.id === over.id);
      return arrayMove(prev, from, to);
    });
  };

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--ink-925)] p-4">
      <DndContext
        /* Explicit id: without it dnd-kit derives its aria-describedby from a
           module-level counter, which differs between the server render and the
           client render and trips a hydration mismatch. */
        id="lp-card-builder"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <ul className="space-y-2">
            {items.map((row, i) => (
              <Row key={row.id} row={row} index={i} accent={accent} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <div className="mt-4 flex items-center gap-2 border-t border-[var(--line)] pt-4">
        {ACCENTS.map((c) => {
          const on = c === accent;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setAccent(c)}
              aria-label={`Accent ${c}`}
              aria-pressed={on}
              className="grid h-11 w-11 place-items-center rounded-full transition-transform duration-150 active:scale-90"
            >
              <span
                className="block h-5 w-5 rounded-full transition-shadow duration-200 ease-out"
                style={{
                  background: c,
                  boxShadow: on
                    ? `0 0 0 2px var(--ink-925), 0 0 0 3.5px ${c}`
                    : "none",
                }}
              />
            </button>
          );
        })}
        <span className="ml-auto text-[11.5px] text-[var(--paper-faint)]">
          plus a picker
        </span>
      </div>
    </div>
  );
}
