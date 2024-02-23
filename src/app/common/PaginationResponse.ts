import { User } from "../model/User";

export class PaginationResponse<T> {
  elementList!: T[];
  totalElements!: number;
  totalPages!: number;
  pageSize!: number;
}
