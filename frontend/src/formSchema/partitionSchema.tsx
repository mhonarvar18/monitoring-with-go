import type { FormSchema } from "../components/Form/formSchema";
import type { PartitionInput } from "../services/partition.service";

export const partitionSchema: FormSchema<PartitionInput> = [
  {
    name: "label",
    label: "نام پارتیشن",
    type: "text",
    required: true,
    wrapperClassName: "col-span-1",
    getInitial: (item) => (item as any).label ?? "",
  },
  {
    name: "localId",
    label: "شماره پارتیشن",
    type: "number",
    required: true,
    wrapperClassName: "col-span-1",
    getInitial: (item) => (item as any).localId ?? "",
  },
];
