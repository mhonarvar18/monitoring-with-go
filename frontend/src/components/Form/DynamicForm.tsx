import type { FieldConfig, FormSchema } from "./formSchema";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { TextField } from "./fields/TextField";
import { NumberField } from "./fields/NumberField";
import ColorField from "./fields/ColorField";
import Button from "../Button";
import { PasswordField } from "./fields/PasswordField";
import SelectionField from "./fields/SelectionField";
import { useUserStore } from "../../store/useUserStore";
import Indicator from "../indicatorSetter/indicatorSetter";

interface Props<T> {
  schema: FormSchema<T>;
  item?: T;
  onSubmit: (data: T) => void;
  onCancel?: () => void;
  layoutColumns?: string;
  validationSchema?: Yup.ObjectSchema<any>;
  serverErrors?: Record<string, string>;
  isSubmitting?:boolean
}

export function DynamicForm<T>({
  schema,
  item,
  onSubmit,
  onCancel,
  validationSchema,
  serverErrors = {},
  layoutColumns = "grid-cols-2",
  isSubmitting
}: Props<T>) {
  const [formState, setFormState] = useState<Record<string, any>>(
    Object.fromEntries(
      schema.map((f) => [f.name, f.getInitial ? f.getInitial(item ?? {} as any) : ""])
    )
  );
  // Separate client-side and server-side errors
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [internalServerErrors, setInternalServerErrors] = useState<
    Record<string, string>
  >({});
  const userInfo = useUserStore((state) => state.userInfo);
  const userType = userInfo?.type;
  // Update internal server errors when serverErrors prop changes
  useEffect(() => {
    setInternalServerErrors(serverErrors);
  }, [serverErrors]);

  // Combine errors for display
  const errors = { ...internalServerErrors, ...clientErrors };

  const handleChange = (name: string, value: any) => {
    setFormState((prev) => ({ ...prev, [name]: value }));

    // Clear client error for this field
    setClientErrors((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });

    // Clear server error for this field
    setInternalServerErrors((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Clear client errors only (keep server errors until submission or fix)
    setClientErrors({});
    if (validationSchema) {
      try {
        await validationSchema.validate(formState, { abortEarly: false });
      } catch (err: any) {
        const newErrors: Record<string, string> = {};
        err.inner?.forEach((validationError: any) => {
          newErrors[validationError.path] = validationError.message;
        });
        setClientErrors(newErrors);
        return;
      }
    } else {
      const newErrors: Record<string, string> = {};
      schema.forEach((field) => {
        if (field.required && !formState[field.name]) {
          newErrors[field.name] = "این فیلد الزامی است";
        }
      });
      if (Object.keys(newErrors).length > 0) {
        setClientErrors(newErrors);
        return;
      }
    }
    onSubmit(formState as T);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full grid ${layoutColumns} gap-2`}
      autoComplete="off"
      dir="rtl"
    >
      <input
        type="text"
        name="fake-username"
        autoComplete="username"
        className="hidden"
      />
      <input
        type="password"
        name="fake-password"
        autoComplete="new-password"
        className="hidden"
      />

      {schema
        .filter((field) => {
          if (field.allowedUserTypes && userType) {
            return field.allowedUserTypes.includes(userType);
          }
          return true;
        })
        .map((field: FieldConfig) => {
          const errorMessage = errors[field.name] || "";

          const common = {
            name: field.name,
            label: field.label,
            required: field.required,
            value: formState[field.name],
            onChange: (v: any) => handleChange(field.name, v),
            error: !!errorMessage,
            errorMessage,
            options: field.options,
          };

          if (field.render) {
            return (
              <div key={field.name} className={field.wrapperClassName}>
                {field.render(
                  {
                    value: formState[field.name],
                    onChange: (v) => handleChange(field.name, v),
                    error: !!errorMessage,
                    errorMessage,
                    required: !!field.required,
                  },
                  item,
                  formState  
                )}
              </div>
            );
          }

          let FieldComponent: React.ReactNode = null;
          switch (field.type) {
            case "text":
              FieldComponent = <TextField key={field.name} {...common} />;
              break;
            case "number":
              FieldComponent = (
                <NumberField
                  key={field.name}
                  {...common}
                  sign={field.sign ?? "any"}
                />
              );
              break;
            case "select":
              FieldComponent = <SelectionField key={field.name} {...common} />;
              break;
            case "color":
              FieldComponent = <ColorField key={field.name} {...common} />;
              break;
            case "password":
              FieldComponent = <PasswordField key={field.name} {...common} />;
              break;
            default:
              return null;
          }

          return (
            <div key={field.name} className={field.wrapperClassName || ""}>
              {FieldComponent}
            </div>
          );
        })}

      <div className="col-span-2 flex items-center justify-between gap-2">
        <Button
          type="submit"
          className="w-1/2 border border-[#09a1a4] bg-btns text-white px-4 py-3"
        >
          {isSubmitting ? <Indicator type="spinner" size={16} /> : "ذخیره"}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className="w-1/2 border border-red-600 text-red-600 px-4 py-3"
        >
          انصراف
        </Button>
      </div>
    </form>
  );
}
