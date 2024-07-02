export type TScopeCategory = string;
export type TScope = `${string}.${string}:${"read" | "write"}`;

export type TScopes = Record<TScopeCategory, TScope[]>;
