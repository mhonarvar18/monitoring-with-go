import type { ReactNode } from "react";

export type FieldType =
  | "text"
  | "number"
  | "select"
  | "custom"
  | "color"
  | "password";

export interface FieldOption {
  label: string;
  errorMessage?: string;
  value: string | number | boolean;
}

export interface FieldConfig {
  /** key in your DTO */
  name: string;
  /** label shown above input */
  label: string;
  /** renders different input components */
  type: FieldType;
  required?: boolean;
  /** only for selects */
  options?: FieldOption[];
  wrapperClassName?: string;
  gridColumn?: string;
  render?: (
    params: {
      value: any;
      onChange: (v: any) => void;
      error?: boolean; // ← add this
      required?: boolean; // ← optionally add this too
      errorMessage?: string;
    },
    item?: any,
    formState?: any
  ) => ReactNode;
  sign?: "positive" | "negative" | "any";
  allowedUserTypes?: string[];
}

export type FormSchema<T> = Array<
  FieldConfig & {
    /** initial value from an existing record */
    getInitial?: (item: T) => string | number | undefined | null;
  }
>;
