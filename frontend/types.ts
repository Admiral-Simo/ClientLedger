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

export interface Client {
  id: number;
  name: string;
  email: string;
  country: string;
  defaultCurrency: string;
  ownerId: string;
}

export interface Contract {
  id: number;
  title: string;
  totalValue: number;
  status: "DRAFT" | "PENDING" | "PAID" | "OVERDUE" | "ACTIVE";
  client: Client;
}
