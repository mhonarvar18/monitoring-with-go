import React, { useState } from "react";
import Modal from "react-modal";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Button from "../../Button";

interface Option {
  key: string;
  label: string;
}
interface Props {
  value: string[];
  onChange: (value: string[]) => void;
  options: Option[];
  error?: string;
  required?: boolean;
  delimiter?: string;
}

const SortableEventFormatSelector: React.FC<Props> = ({
  value,
  onChange,
  options,
  error,
  required,
  delimiter
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const safeValue = Array.isArray(value) ? value : [];

  const selectedLabels = safeValue
    .map((key) => options.find((o) => o.key === key)?.label)
    .filter(Boolean)
    .join(delimiter || ", ");

  return (
    <div className="flex flex-col gap-1" dir="rtl">
      <label>
        فرمت رویداد
        {required && <span className="text-red-600 mx-1">*</span>}
      </label>
      <button
        type="button"
        className="border rounded-xl px-4 py-2 text-center hover:bg-gray-100"
        onClick={() => setModalOpen(true)}
      >
        {selectedLabels || (
          <span className="text-gray-400">انتخاب و ترتیب آیتم‌ها</span>
        )}
      </button>
      {typeof error === "string" && (
        <span className="text-red-500">{error}</span>
      )}

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        ariaHideApp={false}
        overlayClassName="modal-overlay-class fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        className="bg-white rounded-[15px] py-6 px-4 w-[90%] max-w-lg h-auto font-[iransans]"
      >
        <SortableMultiSelectModal
          value={safeValue}
          options={options}
          onClose={() => setModalOpen(false)}
          onChange={onChange}
        />
      </Modal>
    </div>
  );
};

export default SortableEventFormatSelector;

// -----------------------------------------------

function SortableMultiSelectModal({
  value,
  options,
  onClose,
  onChange,
}: {
  value: string[];
  options: Option[];
  onClose: () => void;
  onChange: (value: string[]) => void;
}) {
  // Keep track of order for selected and unselected
  const [selected, setSelected] = useState<string[]>(value);
  const [unselected, setUnselected] = useState<string[]>(
    options.map((o) => o.key).filter((key) => !value.includes(key))
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Drag & Drop for selected items only
  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = selected.indexOf(active.id);
      const newIndex = selected.indexOf(over.id);
      setSelected(arrayMove(selected, oldIndex, newIndex));
    }
  }

  // Add or remove from selected
  function handleCheck(key: string, checked: boolean) {
    if (checked) {
      setUnselected(unselected.filter((k) => k !== key));
      setSelected([...selected, key]);
    } else {
      setSelected(selected.filter((k) => k !== key));
      setUnselected([...unselected, key]);
    }
  }

  // Select All / Deselect All
  function handleSelectAll() {
    setSelected(options.map((o) => o.key));
    setUnselected([]);
  }
  function handleDeselectAll() {
    setSelected([]);
    setUnselected(options.map((o) => o.key));
  }

  const getLabel = (key: string) =>
    options.find((opt) => opt.key === key)?.label ?? key;

  return (
    <div className="p-2 md:p-4" dir="rtl">
      <h2 className="text-lg font-bold mb-2 text-right">
        انتخاب و ترتیب آیتم‌ها
      </h2>
      <div className="flex gap-2 mb-3 justify-start">
        <button
          className="text-xs px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 border"
          onClick={handleSelectAll}
          type="button"
        >
          انتخاب همه
        </button>
        <button
          className="text-xs px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 border"
          onClick={handleDeselectAll}
          type="button"
        >
          حذف همه
        </button>
      </div>

      {/* Selected, sortable list */}
      <div>
        <span className="font-bold text-right block mb-1 text-black">
          آیتم‌های انتخاب شده
        </span>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={selected}
            strategy={verticalListSortingStrategy}
          >
            <ul className="flex flex-col gap-1 min-h-[42px] py-2 border rounded-lg px-2 bg-gray-50">
              {selected.length === 0 && (
                <li className="text-gray-400 text-sm py-2">
                  هیچ آیتمی انتخاب نشده است.
                </li>
              )}
              {selected.map((key) => (
                <SortableCheckboxItem
                  key={key}
                  id={key}
                  label={getLabel(key)}
                  checked={true}
                  onCheck={handleCheck}
                  dragHandle
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>

      {/* Unselected, not sortable */}
      <div className="mt-4">
        <span className="font-bold text-right block mb-1 text-gray-700">
          آیتم‌های حذف شده
        </span>
        <ul className="flex flex-col gap-1 min-h-[36px] py-2 border rounded-lg px-2 bg-gray-50">
          {unselected.length === 0 && (
            <li className="text-gray-300 text-sm py-2">
              همه آیتم‌ها انتخاب شده‌اند.
            </li>
          )}
          {unselected.map((key) => (
            <SortableCheckboxItem
              key={key}
              id={key}
              label={getLabel(key)}
              checked={false}
              onCheck={handleCheck}
            />
          ))}
        </ul>
      </div>

      <div className="w-full flex justify-center items-center gap-2 mt-5">
        <Button
          className="w-1/4 py-3 bg-transparent border-red-600 text-red-600"
          type="button"
          onClick={onClose}
        >
          انصراف
        </Button>
        <Button
          className="w-1/4 py-3 bg-btns text-white"
          type="button"
          onClick={() => {
            onChange(selected);
            onClose();
          }}
        >
          ذخیره
        </Button>
      </div>
    </div>
  );
}

// -----------------------------------------------

function SortableCheckboxItem({
  id,
  label,
  checked,
  onCheck,
  dragHandle,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheck: (key: string, checked: boolean) => void;
  dragHandle?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        background: checked ? "#fff" : "#f8f8f8",
      }}
      className={`rounded-lg border px-2 py-1 flex items-center gap-2 shadow-sm ${
        checked ? "border-[#09a1a4]" : "border-gray-200"
      } ${isDragging ? "ring-1 ring-[#09a1a4]" : ""}`}
    >
      <input
        type="checkbox"
        className="accent-[#09a1a4]"
        checked={checked}
        onChange={(e) => onCheck(id, e.target.checked)}
      />
      <span className={`flex-1 text-right ${!checked ? "text-gray-400" : ""}`}>
        {label}
      </span>
      {dragHandle && (
        <span
          {...attributes}
          {...listeners}
          className="cursor-move text-gray-600"
        >
          ☰
        </span>
      )}
    </li>
  );
}
