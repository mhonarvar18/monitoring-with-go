import type { FormSchema } from "../components/Form/formSchema";
import type { UserInput } from "../services/users.service";
import { LocationSelector } from "../components/Form/fields/LocationSelector";

const userTypeOptions = [
  { value: "OWNER", label: "مالک" },
  { value: "SUPER_ADMIN", label: "اپراتور ارشد" },
  { value: "ADMIN", label: "اپراتور" },
  { value: "USER", label: "کاربر" },
];

export const userSchema = (
  isEditing?: boolean,
  isPendingUser: boolean = false
): FormSchema<UserInput> => {
  return [
    {
      name: "fullname",
      label: "نام و نام خانوادگی",
      type: "text",
      required: !isEditing,
      wrapperClassName: "col-span-1",
      getInitial: (u) => (u as any).fullname ?? "",
    },
    {
      name: "fatherName",
      label: "نام پدر",
      type: "text",
      required: !isEditing,
      wrapperClassName: "col-span-1",
      getInitial: (u) => (u as any).fatherName ?? "",
    },
    {
      name: "username",
      label: "نام کاربری",
      type: "text",
      required: !isEditing,
      wrapperClassName: "col-span-1",
      getInitial: (u) => (u as any).username ?? "",
    },
    {
      name: "nationalityCode",
      label: "کد ملی",
      type: "text",
      required: !isEditing,
      wrapperClassName: "col-span-1",
      getInitial: (u) => (u as any).nationalityCode ?? "",
    },

    // ✅ conditionally include the password field with a spread
    ...(isPendingUser
      ? []
      : [
          {
            name: "password",
            label: "رمز عبور",
            type: "password" as const,
            required: !isEditing,
            wrapperClassName: "col-span-1",
            getInitial: (u) => (u as any).password ?? "",
            allowedUserTypes: ["OWNER"], // ensure your FieldConfig type allows this
          },
        ]),

    {
      name: "personalCode",
      label: "کد پرسنلی",
      type: "text",
      required: !isEditing,
      wrapperClassName: "col-span-1",
      getInitial: (u) => (u as any).personalCode ?? "",
    },
    {
      name: "phoneNumber",
      label: "شماره تماس",
      type: "text",
      required: !isEditing,
      wrapperClassName: "col-span-1",
      getInitial: (u) => (u as any).phoneNumber ?? "",
    },
    {
      name: "ip",
      label: "آی‌پی",
      type: "text",
      required: !isEditing,
      wrapperClassName: `${isPendingUser ? "col-span-2" : "col-span-1"}`,
      getInitial: (u) => (u as any).ip ?? "",
    },
    {
      name: "type",
      label: "نوع کاربر",
      type: "select",
      required: !isEditing,
      wrapperClassName: "col-span-2",
      options: userTypeOptions,
      getInitial: (u) => (u as any).type ?? "",
    },
    {
      name: "locationId",
      label: "موقعیت شعبه",
      type: "custom",
      required: !isEditing,
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
      required: !isEditing,
      wrapperClassName: "col-span-2",
      getInitial: (u) => (u as any).address ?? "",
    },
  ];
};
