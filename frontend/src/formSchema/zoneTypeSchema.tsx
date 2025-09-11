import type { FormSchema } from "../components/Form/formSchema";
import type { ZoneTypeInput } from "../services/zoneTypeCrud.service";

export const zoneTypeSchema: FormSchema<ZoneTypeInput> = [
  {
    name: "label",
    label: "نام زون",
    type: "text",
    required: true,
    wrapperClassName: "col-span-2",
    getInitial: (b) => (b as any).label,
  },
];
