import { useState } from "react";
import { createStaff, updateStaff } from "../../services/staffService";

function StaffForm({ onClose, onSuccess, staff }) {
    const isEditMode = !!staff;

    const [formData, setFormData] = useState({
        fullName: staff?.fullName || "",
        email: staff?.email || "",
        phone: staff?.phone || "",
        isActive: staff?.isActive !== undefined ? staff.isActive : true,
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "phone") {
            // Only allow numbers
            const numbersOnly = value.replace(/\D/g, "");
            setFormData({
                ...formData,
                [name]: numbersOnly,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }

        // Clear error when editing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full Name is required";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.phone) {
            newErrors.phone = "Phone number is required";
        } else if (formData.phone.length !== 10) {
            newErrors.phone = "Phone number must be exactly 10 digits";
        }

        if (!isEditMode) {
            if (!formData.password) {
                newErrors.password = "Password is required";
            } else if (formData.password.length < 8) {
                newErrors.password = "Password must be at least 8 characters";
            }

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");

        if (!validate()) {
            return;
        }

        setLoading(true);
        try {
            let result;
            if (isEditMode) {
                result = await updateStaff(staff.id, {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    isActive: formData.isActive,
                });
            } else {
                result = await createStaff({
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                });
            }

            if (result.success) {
                onSuccess(result.message || (isEditMode ? "Staff member updated successfully!" : "Staff member created successfully!"));
            } else {
                setSubmitError(result.message || "Failed to save staff member");
            }
        } catch (error) {
            console.error("Submission error:", error);
            const msg = error.response?.data?.message || error.message || "An error occurred";
            setSubmitError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-0">
            <div className="modal-header">
                <h5 className="modal-title fw-bold">
                    {isEditMode ? "Edit Staff Member" : "Add Staff Member"}
                </h5>
                <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    disabled={loading}
                    aria-label="Close"
                ></button>
            </div>

            <div className="modal-body">
                {submitError && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Error:</strong> {submitError}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setSubmitError("")}
                            aria-label="Close"
                        ></button>
                    </div>
                )}

                <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                    />
                    {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label fw-semibold">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john.doe@example.com"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label fw-semibold">Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                        maxLength={10}
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>

                {isEditMode && (
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Status</label>
                        <select
                            name="isActive"
                            className="form-select"
                            value={formData.isActive ? "true" : "false"}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                )}

                {!isEditMode && (
                    <>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Password</label>
                            <input
                                type="password"
                                name="password"
                                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Minimum 8 characters"
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter password"
                            />
                            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                        </div>
                    </>
                )}
            </div>

            <div className="modal-footer bg-light">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="btn btn-primary d-flex align-items-center gap-2"
                    disabled={loading}
                >
                    {loading && (
                        <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    )}
                    {loading ? "Saving..." : (isEditMode ? "Update" : "Save Staff")}
                </button>
            </div>
        </form>
    );
}

export default StaffForm;