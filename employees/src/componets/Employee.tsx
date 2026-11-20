import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Employee } from "../types/employee.types";

interface EmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee?: Employee | null;
}

interface FormValues {
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  role: Yup.string().required("Please select an employee role"),
  createdAt: Yup.string().required("Created date is required"),
});

const API_BASE_URL = "http://localhost:5001/api/employees";

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  employee,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isEditMode = Boolean(employee && employee.id);

  // Format existing date to YYYY-MM-DD for HTML date input
  const formatInitialDate = (dateStr?: string) => {
    if (!dateStr) return new Date().toISOString().split("T")[0];
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return new Date().toISOString().split("T")[0];
      return d.toISOString().split("T")[0];
    } catch {
      return new Date().toISOString().split("T")[0];
    }
  };

  const initialValues: FormValues = {
    name: employee?.name || "",
    email: employee?.email || "",
    role: employee?.role || "",
    createdAt: formatInitialDate(employee?.createdAt),
  };

  const formik = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      setErrorMessage(null);

      const url = isEditMode
        ? `${API_BASE_URL}/${employee!.id}`
        : API_BASE_URL;
      const method = isEditMode ? "PUT" : "POST";

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok || data.success === false) {
          throw new Error(data.message || "Something went wrong saving the employee.");
        }

        onSuccess();
        onClose();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to save employee";
        setErrorMessage(msg);
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 sm:p-8 text-left shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                isEditMode ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
              }`}
            >
              {isEditMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900" id="modal-title">
                {isEditMode ? "Update Employee" : "Create New Employee"}
              </h3>
              <p className="text-xs text-gray-500">
                {isEditMode ? `Editing ID #${employee?.id}` : "Fill in the details to add an employee"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-lg p-1.5 transition"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <div className="mb-5 rounded-lg bg-red-50 p-3.5 border border-red-200 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-red-800">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Employee Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Employee Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. John Doe"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 ${
                formik.touched.name && formik.errors.name
                  ? "border-red-400 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="mt-1 text-xs text-red-600 font-medium">
                {formik.errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. john.doe@company.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 ${
                formik.touched.email && formik.errors.email
                  ? "border-red-400 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-xs text-red-600 font-medium">
                {formik.errors.email}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 ${
                formik.touched.role && formik.errors.role
                  ? "border-red-400 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            >
              <option value="">Select an employee role</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="EMPLOYEE">Employee</option>
            </select>
            {formik.touched.role && formik.errors.role && (
              <p className="mt-1 text-xs text-red-600 font-medium">
                {formik.errors.role}
              </p>
            )}
          </div>

          {/* Created At */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Joined / Created Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="createdAt"
              value={formik.values.createdAt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 ${
                formik.touched.createdAt && formik.errors.createdAt
                  ? "border-red-400 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
            {formik.touched.createdAt && formik.errors.createdAt && (
              <p className="mt-1 text-xs text-red-600 font-medium">
                {formik.errors.createdAt}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                isEditMode
                  ? "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              }`}
            >
              {submitting && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {isEditMode ? "Update Employee" : "Create Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
