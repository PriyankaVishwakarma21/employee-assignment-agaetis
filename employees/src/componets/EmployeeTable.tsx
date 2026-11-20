import React from "react";
import type { Employee } from "../types/employee.types";

interface EmployeeTableProps {
  employees: Employee[];
  loading: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (id: number, name: string) => void;
  onAddNew: () => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  loading,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  const getRoleBadge = (role: string) => {
    const normalizedRole = role?.toUpperCase();
    if (normalizedRole === "ADMIN") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
          Admin
        </span>
      );
    } else if (normalizedRole === "MANAGER") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
          Manager
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
        Employee
      </span>
    );
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Table Header Bar */}
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employees Directory</h2>
          <p className="mt-1 text-sm text-gray-500">
            A complete list of all employees in your organization with management actions.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={onAddNew}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Employee
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white shadow-sm ring-1 ring-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <svg
              className="animate-spin h-10 w-10 text-blue-600 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-base font-medium">Loading employee records...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No employees found</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
              Get started by creating your first employee record.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={onAddNew}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Employee
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                  >
                    Created Date
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-6 text-right text-xs font-semibold uppercase tracking-wider text-gray-600"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-gray-50/75 transition duration-150"
                  >
                    {/* ID */}
                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-500">
                      #{employee.id}
                    </td>

                    {/* Name */}
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase">
                          {employee.name ? employee.name.charAt(0) : "E"}
                        </div>
                        <span>{employee.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      {employee.email}
                    </td>

                    {/* Role */}
                    <td className="whitespace-nowrap px-4 py-4 text-sm">
                      {getRoleBadge(employee.role)}
                    </td>

                    {/* Created Date */}
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                      {formatDate(employee.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap py-4 pl-4 pr-6 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {/* Update Button */}
                        <button
                          type="button"
                          onClick={() => onEdit(employee)}
                          className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 hover:text-blue-800 transition"
                          title="Update Employee"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Update
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => onDelete(employee.id, employee.name)}
                          className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 hover:text-red-800 transition"
                          title="Delete Employee"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        {!loading && employees.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
            <span>
              Total records: <strong className="text-gray-700">{employees.length}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeTable;
