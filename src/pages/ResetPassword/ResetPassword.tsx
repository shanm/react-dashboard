import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import { resetPassword } from "../../api/authApi";

import "./ResetPassword.css";

function ResetPassword() {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match.");
            return;
        }

        setLoading(true);

        try {
            await resetPassword(currentPassword, newPassword, confirmPassword);
            setSuccess("Password reset successfully.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);
        } catch (submitError) {
            setError(
                submitError instanceof Error ? submitError.message : "Password reset failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-page">
            <Header title="Reset Password" />

            <main className="page-content">
                <div className="reset-card">
                    <div className="login-header">
                        <p className="eyebrow">Security</p>
                        <h2>Update your password</h2>
                    </div>

                    <form className="reset-form" onSubmit={handleSubmit}>
                        <div className="field-group">
                            <label htmlFor="currentPassword">Current Password</label>
                            <input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(event) => setCurrentPassword(event.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        {error && <p className="form-message error" role="alert">{error}</p>}
                        {success && <p className="form-message success">{success}</p>}

                        <button className="primary-button" type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Reset password"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default ResetPassword;
