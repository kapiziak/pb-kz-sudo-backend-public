import { User } from "@prisma/client";
import TApiError from "../errors/api-errors";

export type TGetAllUserResponse = TApiResponse<{
  users: Pick<User, "id" | "email" | "role">[];
}>;

export const userErrors: Record<string, TApiError> = {
  missingPermissions: {
    code: "AUTH_MISSING_PERMISSIONS",
    message: "Not enough permissions for this action",
  },
};
