import type { FormSchema } from "../components/Form/formSchema";
import type { BranchInput } from "../services/branchCrud.service";
import { LocationSelector } from "../components/Form/fields/LocationSelector";
import EmergencyCallField from "../components/Form/fields/EmergencyCallField";

export function branchSchema(isEditForm: boolean): FormSchema<BranchInput> {
  return [
    {
      name: "name",
      label: "نام شعبه",
      type: "text",
      required: !isEditForm,
      wrapperClassName: "col-span-1",
      getInitial: (b) => (b as any).name,
    },
    {
      name: "code",
      label: "کد شعبه",
      type: "number",
      required: !isEditForm,
      sign: "positive",
      wrapperClassName: "col-span-1",
      getInitial: (b) => (b as any).code,
    },
    {
      name: "locationId",
      label: "موقعیت شعبه",
      type: "custom",
      required: !isEditForm,
      wrapperClassName: "col-span-2",
      getInitial: (b) => (b as any).location?.id ?? (b as any).locationId ?? "",
      render: ({ value, onChange, error, required }, item) => (
        <LocationSelector
          value={value}
          item={item}
          onChange={onChange}
          error={error}
          required={required}
          prefillLocation={item?.location}
        />
      ),
    },
    {
      name: "address",
      label: "آدرس",
      type: "text",
      required: false,
      wrapperClassName: "col-span-1",
      getInitial: (b) => (b as any).address,
    },
    {
      name: "phoneNumber",
      label: "شماره تماس",
      type: "text",
      required: false,
      sign: "positive",
      wrapperClassName: "col-span-1",
      getInitial: (b) => (b as any).phoneNumber || null,
    },
    {
      name: "panelTypeId",
      label: "نوع پنل",
      type: "select",
      required: !isEditForm,
      wrapperClassName: "col-span-2",
      getInitial: (b) =>
        (b as any).panelTypeId ?? (b as any).panelType?.id ?? "",
      options: [],
    },
    ...(isEditForm
      ? [
          {
            name: "mainPartitionId",
            label: "پارتیشین مرجع",
            type: "select" as const,
            required: false,
            wrapperClassName: "col-span-2",
            getInitial: (b) => (b as any).mainPartitionId,
            options: [],
          },
        ]
      : []),
    {
      name: "panelIp",
      label: "آیپی پنل",
      type: "text",
      required: false,
      wrapperClassName: "col-span-1",
      getInitial: (b) => (b as any).panelIp,
    },
    {
      name: "panelCode",
      label: "سریال پنل",
      type: "number",
      required: false,
      wrapperClassName: "col-span-1",
      getInitial: (b) => (b as any).panelCode,
    },
    {
      name: "emergencyCall",
      label: "شماره‌های اضطراری",
      type: "custom",
      required: false,
      wrapperClassName: "col-span-2",
      getInitial: (b) => b.emergencyCall ?? null,
      render: ({ value, onChange, error, required }) => (
        <EmergencyCallField
          value={value}
          onChange={onChange}
          error={error}
          required={required}
        />
      ),
    },
  ];
}
