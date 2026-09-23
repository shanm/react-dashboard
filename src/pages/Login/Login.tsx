import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login as loginApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

import "./Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await loginApi(username, password);
            login(data);
            navigate("/dashboard");
        } catch (currentError) {
            setError(
                currentError instanceof Error ? currentError.message : "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <p className="eyebrow">Welcome back</p>
                    <h2>Login</h2>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="field-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            required
                            disabled={loading}
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            disabled={loading}
                            placeholder="Enter your password"
                        />
                    </div>

                    {error && <p className="form-message error" role="alert">{error}</p>}

                    <button className="primary-button" type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
