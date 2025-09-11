import type { FormSchema } from "../components/Form/formSchema";
import type { LocationInput } from "../hooks/useLocationsByType";

export const LocationSchema: FormSchema<LocationInput> = [
  {
    name: "label",
    label: "نام",
    type: "text",
    required: true,
    wrapperClassName: "col-span-2",
    getInitial: (item) => (item as any).label ?? "",
  },
];
