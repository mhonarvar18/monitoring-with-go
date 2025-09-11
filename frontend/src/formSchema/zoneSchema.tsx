import type { FormSchema } from "../components/Form/formSchema";
import type { ZoneInput } from "../services/zone.service";
import type { FieldOption } from "../components/Form/formSchema";

// The function returns a schema given partition/zoneType options
export function zoneSchema(
  partitionOptions: FieldOption[],
  zoneTypeOptions: FieldOption[]
): FormSchema<ZoneInput> {
  return [
    {
      name: "label",
      label: "نام زون",
      type: "text",
      required: true,
      wrapperClassName: "col-span-1",
      getInitial: (z) => (z as any).label ?? "",
    },
    {
      name: "localId",
      label: "شماره زون",
      type: "number",
      required: true,
      wrapperClassName: "col-span-1",
      getInitial: (z) => (z as any).localId ?? "",
    },
    {
      name: "partitionId",
      label: "پارتیشن",
      type: "select",
      required: true,
      options: partitionOptions,
      wrapperClassName: "col-span-1",
      getInitial: (z) => (z as any).partitionId ?? "",
    },
    {
      name: "zoneTypeId",
      label: "نوع زون",
      type: "select",
      required: true,
      options: zoneTypeOptions,
      wrapperClassName: "col-span-1",
      getInitial: (z) => (z as any).zoneTypeId ?? "",
    },
    
  ];
}
