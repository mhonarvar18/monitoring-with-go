import type { FormSchema } from "../components/Form/formSchema";
import type { AlarmInput } from "../services/alarms.service";

// Static select options
const protocolOptions = [
  { value: "IP", label: "IP" },
  { value: "TELL", label: "تلفن" },
];
const typeOptions = [
  { value: "ZONE", label: "زون" },
  { value: "USER", label: "کاربر" },
];

export const alarmSchema = (
  categoryOptions: { value: string | number; label: string }[]
): FormSchema<AlarmInput> => [
  {
    name: "code",
    label: "کد آلارم",
    type: "number",
    required: true,
    sign: "positive",
    wrapperClassName: "col-span-1",
    getInitial: (b) => (b as any).code ?? "",
  },
  {
    name: "label",
    label: "عنوان آلارم",
    type: "text",
    required: true,
    wrapperClassName: "col-span-1",
    getInitial: (b) => (b as any).label ?? "",
  },
  {
    name: "protocol",
    label: "پروتکل",
    type: "select",
    required: true,
    options: protocolOptions,
    wrapperClassName: "col-span-2",
    getInitial: (b) => (b as any).protocol ?? "",
  },
  {
    name: "type",
    label: "نوع",
    type: "select",
    required: true,
    options: typeOptions,
    wrapperClassName: "col-span-1",
    getInitial: (b) => (b as any).type ?? "",
  },
  {
    name: "categoryId",
    label: "دسته‌بندی آلارم",
    type: "select",
    required: false,
    options: categoryOptions, // Pass dynamically
    wrapperClassName: "col-span-1",
    getInitial: (b) => (b as any).categoryId ?? "",
  },
  {
    name: "description",
    label: "توضیحات",
    type: "text",
    required: false,
    wrapperClassName: "col-span-2",
    getInitial: (b) => (b as any).description ?? "",
  },
];
