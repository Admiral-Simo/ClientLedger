export interface Client {
  id: number;
  name: string;
  email: string;
  // add other client fields if needed
}

export interface Contract {
  id: number;
  title: string;
  totalValue: number;
  currency: string;
  status: "DRAFT" | "PENDING" | "PAID" | "OVERDUE";
  createdAt: string; // ISO Date string
  ownerId: string;
  client: Client;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Current page index
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ContractFilters {
  page: number;
  size: number;
  status?: string;
  search?: string;
  clientId?: number;
}
