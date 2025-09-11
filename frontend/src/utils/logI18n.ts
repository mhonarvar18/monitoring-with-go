import type { TFunction } from "i18next";
import { localizeValue } from "./localizeDate&colors";

// Translates the model name to its localized version
export const toFaModel = (t: TFunction, model: string) =>
  t(`models.${model}`, model);

// Translates the action name to its localized version
export const toFaAction = (t: TFunction, action: string) =>
  t(`actions.${action}`, action);

// Gets the field label for the given model and key. First tries to find the field-specific translation, then falls back to common fields
const fieldLabel = (t: TFunction, model: string, key: string) =>
  t(`fields.${model}.${key}`, t(`fields.common.${key}`, key));

// Handles enum values. If the field is an enum, it translates the enum value
const fieldValueWithEnum = (
  t: TFunction,
  model: string,
  key: string,
  value: any
) => {
  // Checks if the field is an enum by matching the enum marker "@enums.<EnumName>"
  const enumMarker = t(`fields.${model}.${key}`, { defaultValue: "" });
  if (typeof enumMarker === "string" && enumMarker.startsWith("@enums.")) {
    const enumName = enumMarker.replace("@enums.", ""); // Extracts enum name
    return t(`enums.${enumName}.${String(value)}`, String(value)); // Translates the enum value
  }
  return value; // Returns the original value if not an enum
};

// Recursively translates an object's keys and nested values
const translateKv = (t: TFunction, model: string, obj: any): any => {
  if (obj == null) return obj; // If the object is null or undefined, return it as is
  if (Array.isArray(obj)) return obj.map((it) => translateKv(t, model, it)); // Recursively translate array elements
  if (typeof obj !== "object") return localizeValue(obj); // If it's not an object, return the value directly

  const out: Record<string, any> = {}; // Object to store the translated result
  for (const [k, v] of Object.entries(obj)) {
    const label = fieldLabel(t, model, k); // Translate the field label
    let val: any = v;

    if (v && typeof v === "object" && !Array.isArray(v)) {
      // If the value is an object (excluding arrays), recursively translate nested objects
      const nestedModel = k === "parent" ? "Location" : model; // Special case for "parent"
      val = translateKv(t, nestedModel, v);
    } else {
      val = fieldValueWithEnum(t, model, k, v); // Translate enum values
      val = localizeValue(val);
    }
    out[label] = val; // Add the translated key-value pair to the output object
  }
  return out;
};

// Localizes the log by translating model, action, and changed fields (before and after)
export const localizeLog = (t: TFunction, log: any) => {
  const modelName = toFaModel(t, log.model); // Translate model name
  const actionLabel = toFaAction(t, log.action); // Translate action label
  const before_i18n = translateKv(t, log.model, log.changedFields?.before); // Translate "before" changed fields
  const after_i18n = translateKv(t, log.model, log.changedFields?.after); // Translate "after" changed fields

  return {
    ...log,
    modelName,
    actionLabel,
    changedFields_i18n: {
      ...(before_i18n ? { before: before_i18n } : {}), // Only include "before" if it's defined
      ...(after_i18n ? { after: after_i18n } : {}), // Only include "after" if it's defined
    },
  };
};
