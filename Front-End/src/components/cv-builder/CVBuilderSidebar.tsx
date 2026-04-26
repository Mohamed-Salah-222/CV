import React from "react";
import styles from "./CVBuilder.module.css";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SidebarProps {
  sectionOrder: string[];
  activeSection: string;
  onSectionClick: (id: string) => void;
  onReorder: (event: DragEndEvent) => void;
  sectionLabels: Record<string, string>;
  children: React.ReactNode;
}

function SortableNavItem({ id, label, isActive, onClick }: { id: string; label: string; isActive: boolean; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <button 
        className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`} 
        onClick={onClick}
      >
        <span {...attributes} {...listeners} className={styles.dragHandle} style={{ fontSize: 16 }}>⠿</span>
        <span style={{ 
          width: 8, height: 8, borderRadius: "50%", 
          background: isActive ? "var(--accent)" : "var(--border)",
          transition: "background 0.2s" 
        }} />
        {label}
      </button>
    </div>
  );
}

export function CVBuilderSidebar({
  sectionOrder,
  activeSection,
  onSectionClick,
  onReorder,
  sectionLabels,
  children,
}: SidebarProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.sectionNav}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onReorder}>
          <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
            {sectionOrder.map((secId) => (
              <SortableNavItem
                key={secId}
                id={secId}
                label={sectionLabels[secId] || secId}
                isActive={activeSection === secId}
                onClick={() => onSectionClick(secId)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </nav>

      <div className={styles.formArea}>
        <div className={styles.sectionTitle}>{sectionLabels[activeSection]}</div>
        {children}
      </div>
    </aside>
  );
}
