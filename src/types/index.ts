export interface User {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
}

export interface SanpoRecord {
  id: string;
  userId: string;
  where: string | null;
  what: string | null;
  memo: string;
  createdAt: Date;
}

export type OracleType = 'where' | 'what';
export type RevealState = 'idle' | 'spinning' | 'revealed';
