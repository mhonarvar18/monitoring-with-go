import type { PendingUser } from "../services/reqRegister.service";
import type { UserInput } from "../services/users.service";


export function toPendingUserUpdate(
  src: Partial<UserInput>,
  base?: PendingUser
): Partial<PendingUser> {
  // Only keys your backend actually accepts for update:
  const allowed: (keyof PendingUser)[] = [
    "fullname",
    "phoneNumber",
    "address",
    "nationalityCode",
    "fatherName",
    "personalCode",
    "type",
    "status",
    "profileCompleted",
    "username",
    "ip",
    "locationId",
  ];

  const out: Partial<PendingUser> = {};

  // 1) Copy scalar/common keys if present
  for (const k of allowed) {
    if (k in src) (out as any)[k] = (src as any)[k];
  }

  // 2) Map nested location -> locationId (if your form sends a nested location)
  if ("location" in src && (src as any).location) {
    const loc: any = (src as any).location;
    const derivedLocationId =
      loc?.id ?? loc?.parent?.id ?? loc?.parentId ?? base?.locationId;

    if (derivedLocationId !== undefined) {
      out.locationId = derivedLocationId;
    }
  }

  return out;
}