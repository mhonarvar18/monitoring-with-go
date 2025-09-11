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
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { useSettingColumnLogic } from "../hooks/useSettingColumnLogic";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  darkMode?: boolean;
}

type SortableItemProps = {
  id: string;
  label: string;
  disabled?: boolean;
};

export default function SettingColumnDrawer({
  isOpen,
  onClose,
  onSuccess,
  darkMode = false,
}: Props) {
  const sensors = useSensors(useSensor(PointerSensor));
  const logic = useSettingColumnLogic(onSuccess);

  const SortableItem = ({ id, label, disabled } : SortableItemProps) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id, disabled });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: disabled ? 0.4 : isDragging ? 0.6 : 1,
      backgroundColor: isDragging
        ? "#e0f2fe"
        : disabled
        ? "#f3f3f3"
        : "#ffffff",
      boxShadow: isDragging
        ? "0 0 10px rgba(0, 123, 255, 0.5)"
        : "0 1px 3px rgba(0, 0, 0, 0.1)",
      cursor: disabled ? "not-allowed" : "move",
    };

    return (
      <li
        ref={setNodeRef}
        style={style}
        {...(!disabled && { ...attributes, ...listeners })}
        className="flex justify-between items-center gap-4 border border-[#afacaf] px-3 py-2 rounded"
      >
        <span className="text-sm">{label}</span>
      </li>
    );
  };

  const renderOrderingColumn = () => {
    const entries = Object.entries(logic.updatedIndexColumns)
      .filter(([key]) => !logic.updatedHiddenColumns[key])
      .sort((a, b) => (a[1] as number) - (b[1] as number))
      .map(([key]) => key);

    return (
      <div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={({ active, over }) =>
            logic.handleDragEnd(active.id as string, over?.id as string)
          }
        >
          <SortableContext
            items={entries}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-1 mb-2 text-black">
              {entries.map((key) => (
                <SortableItem
                  key={key}
                  id={key}
                  label={logic.labelOverrides[key] || key}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>

        <div className="flex justify-center items-center mt-2 gap-2">
          {logic.hasChanges && (
            <button
              onClick={logic.handleSaveOrder}
              className="w-full bg-[#09A1A4] text-white px-4 py-2 rounded"
            >
              ذخیره
            </button>
          )}
          <button
            onClick={logic.handleResetOrder}
            className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            بازنشانی
          </button>
        </div>
      </div>
    );
  };

  const renderTrueFalseColumn = () => (
    <div>
      <ul className="flex flex-col justify-start items-start gap-1 w-full">
        {Object.entries(logic.updatedHiddenColumns).map(([key, isHidden]) => (
          <li
            key={key}
            className="w-full flex justify-between items-center border-b py-1"
          >
            <span className="text-sm text-black">
              {logic.labelOverrides[key] || key}
            </span>
            <label className="rtl relative flex justify-between items-center text-xl">
              <input
                type="checkbox"
                checked={!isHidden}
                onChange={() => logic.handleToggleColumnVisibility(key)}
                className="absolute right-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md"
              />
              <span className="w-12 h-6 flex items-center flex-shrink-0 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:-translate-x-6"></span>
            </label>
          </li>
        ))}
      </ul>

      <div className="flex justify-center items-center mt-2 gap-2">
        {logic.hasVisibilityChanges && (
          <button
            onClick={logic.handleSaveHiddenColumns}
            disabled={logic.loading || logic.hiddenSettingId === null}
            className="w-full bg-[#09A1A4] text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ذخیره
          </button>
        )}

        <button
          onClick={logic.handleResetVisibility}
          className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded"
        >
          بازنشانی
        </button>
      </div>
    </div>
  );

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      direction="left"
      style={{ width: "400px" }}
      className="py-1 px-4 font-iransans"
    >
      {/* Add dir="rtl" here */}
      <div dir="rtl">
        <div className="flex border-b mb-2">
          <button
            className={`flex-1 text-sm font-medium ${
              logic.activeTab === "True/FalseColumn"
                ? "border-b-2 mt-2 pb-2 border-blue-500"
                : ""
            }`}
            onClick={() => logic.handleTabSwitch("True/FalseColumn")}
          >
            فعال/غیرفعال کردن
          </button>
          <button
            className={`flex-1 text-sm font-medium ${
              logic.activeTab === "OrdringColumn"
                ? "border-b-2 mt-2 pb-2 border-blue-500"
                : ""
            }`}
            onClick={() => logic.handleTabSwitch("OrdringColumn")}
          >
            مرتب‌سازی ستون‌ها
          </button>
        </div>

        <div>
          {logic.loading ? (
            <p className="text-gray-500">در حال بارگذاری...</p>
          ) : logic.activeTab === "True/FalseColumn" ? (
            renderTrueFalseColumn()
          ) : (
            renderOrderingColumn()
          )}
        </div>
      </div>
    </Drawer>
  );
}
