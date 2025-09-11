import SortableEventFormatSelector from "../components/Form/fields/SortableEventFormatSelector";
import type { FormSchema } from "../components/Form/formSchema";
import type { PanelTypeInput } from "../services/panelType.service";

const eventFormatOptions = [
  { key: "year", label: "سال" },
  { key: "month", label: "ماه" },
  { key: "day", label: "روز" },
  { key: "hour", label: "ساعت" },
  { key: "minute", label: "دقیقه" },
  { key: "panelCode", label: "کد پنل" },
  { key: "alarmCode", label: "کد آلارم" },
  { key: "zoneId", label: "زون" },
  { key: "employeeId", label: "کد اپراتور" },
  { key: "partitionNumber", label: "شماره پارتیشن" },
  { key: "eventReference", label: "کد ارجاع" },
];

export const panelTypeSchema = (isEdit : boolean): FormSchema<PanelTypeInput> => [
  {
    name: "name",
    label: "نام پنل",
    type: "text",
    required: isEdit ? false : true,
    wrapperClassName: "col-span-1",
    getInitial: (item) => (item as any).name ?? "",
  },
  {
    name: "model",
    label: "مدل پنل",
    type: "text",
    required: isEdit ? false : true,
    wrapperClassName: "col-span-1",
    getInitial: (item) => (item as any).model ?? "",
  },
  {
    name: "delimiter",
    label: "کاراکتر جداکننده",
    type: "text",
    required: isEdit ? false : true,
    wrapperClassName: "col-span-1",
    getInitial: (item) => (item as any).delimiter ?? "",
  },
  {
    name: "code",
    label: "کد پنل",
    type: "number",
    required: isEdit ? false : true,
    wrapperClassName: "col-span-1",
    getInitial: (item) => (item as any).code ?? "",
  },
  {
    name: "eventFormat",
    label: "فرمت رویداد",
    type: "custom",
    required: isEdit ? false : true,
    wrapperClassName: "col-span-2",
    getInitial: (item) => {
      if (item == null) return eventFormatOptions.map((opt) => opt.key); // create
      if (Array.isArray((item as any).eventFormat))
        return (item as any).eventFormat;
      return eventFormatOptions.map((opt) => opt.key); // fallback
    },
    render: ({ value, onChange, error, required }, item, formState) => (
      <SortableEventFormatSelector
        value={value}
        onChange={onChange}
        options={eventFormatOptions}
        error={typeof error === "string" ? error : undefined}
        required={required}
        delimiter={formState.delimiter || ","} // pass the delimiter from form state
      />
    ),
  },
];
