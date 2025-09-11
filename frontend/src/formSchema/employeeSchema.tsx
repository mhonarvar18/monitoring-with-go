import type { FormSchema } from "../components/Form/formSchema";
import type { EmployeeInput } from "../services/employee.service";

// ✔️ No ": FormSchema<…>" on the variable —
//    we annotate the function’s return type instead.
export const employeeSchema = (
  isEdit: boolean
): FormSchema<EmployeeInput> => {
  const schema: FormSchema<EmployeeInput> = [
    {
      name: "name",
      label: "نام",
      type: "text",
      required: true,
      wrapperClassName: "col-span-2",
      getInitial: (e) => e.name ?? "",
    },
    {
      name: "lastName",
      label: "نام خانوادگی",
      type: "text",
      required: true,
      wrapperClassName: "col-span-1",
      getInitial: (e) => e.lastName ?? "",
    },
    {
      name: "localId",
      label: "شماره کارمند",
      type: "number",
      required: true,
      wrapperClassName: "col-span-1",
      getInitial: (e) => e.localId ?? "",
    },
  ];

  if (!isEdit) {
    schema.push(
      {
        name: "position",
        label: "سمت",
        type: "text",
        required: true,
        wrapperClassName: "col-span-1",
        getInitial: (e) => e.position ?? "",
      },
      {
        name: "nationalCode",
        label: "شماره پرسنلی",
        type: "text",
        required: false,
        wrapperClassName: "col-span-1",
        getInitial: (e) => e.nationalCode ?? "",
      }
    );
  }

  return schema;
};
