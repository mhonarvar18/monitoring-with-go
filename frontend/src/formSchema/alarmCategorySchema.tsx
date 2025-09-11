import type { FormSchema } from "../components/Form/formSchema";
import type { AlarmCategoryInput } from "../services/alarmCategoriesCrud.service";

const priorityOptions = [
  { value: "VERY_HIGH", label: "خیلی زیاد" },
  { value: "HIGH", label: "زیاد" },
  { value: "MEDIUM", label: "متوسط" },
  { value: "LOW", label: "کم" },
];

const needsApproval = [
  { value: "true", label: "دارد" },
  { value: "false", label: "ندارد" },
];

export const alarmCategorySchema = (isEditing: boolean): FormSchema<AlarmCategoryInput> => {
  return [
    {
      name: "code",
      label: "کد",
      type: "number",
      required: isEditing ? false : true,
      sign: "positive",
      wrapperClassName: "col-span-2",
      getInitial: (b) => (b as any).code ?? "",
    },
    {
      name: "label",
      label: "نام دسته بندی",
      type: "text",
      required: isEditing ? false : true,
      wrapperClassName: "col-span-2",
      getInitial: (b) => (b as any).label ?? "",
    },
    {
      name: "priority",
      label: "اولویت",
      type: "select",
      required: isEditing ? false : true,
      wrapperClassName: "col-span-2",
      options: priorityOptions,
      getInitial: (b) => (b as any).priority ?? "",
    },
    {
      name: "needsApproval",
      label: "نیاز به تایید",
      type: "select",
      required: isEditing ? false : true,
      wrapperClassName: "col-span-2",
      options: needsApproval,
      getInitial: (b) =>
        typeof (b as any).needsApproval === "boolean"
          ? (b as any).needsApproval
          : "",
    },
  ];
};
