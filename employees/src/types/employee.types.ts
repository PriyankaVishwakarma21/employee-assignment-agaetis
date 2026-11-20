
export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export type EmployeeFormData = Omit<
  Employee,
  "id" | "createdAt" | "updatedAt"
>;
