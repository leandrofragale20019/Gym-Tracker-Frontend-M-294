export const ROLES = {
  READ: 'ROLE_READ',
  UPDATE: 'ROLE_UPDATE',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];