import { useEffect, useState } from "react";

import Header from "../../components/Header/Header";
import Card from "../../components/Card/Card";
import { getCurrentUser, getUsers } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

import type { User } from "../../types/user";

import "./Dashboard.css";

function Dashboard() {
    const { user } = useAuth();
    const [currentUser, setCurrentUser] = useState(user);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [profile, list] = await Promise.all([
                    getCurrentUser().catch(() => null),
                    getUsers().catch(() => []),
                ]);

                setCurrentUser(profile ?? user ?? null);
                setUsers(list);
            } catch {
                setCurrentUser(user ?? null);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [user]);

    const primaryRole = typeof currentUser?.role === "string" ? currentUser.role : typeof user?.role === "string" ? user.role : "User";
    const userCount = users.length;
    const displayName = typeof currentUser?.fullName === "string"
        ? currentUser.fullName
        : typeof currentUser?.name === "string"
            ? currentUser.name
            : typeof currentUser?.username === "string"
                ? currentUser.username
                : "User";

    return (
        <div className="dashboard-page">
            <Header title="Dashboard" />

            <main className="page-content">
                {loading ? (
                    <div className="status-panel">
                        <p>Loading dashboard data...</p>
                    </div>
                ) : (
                    <>
                        <section className="welcome-panel">
                            <p className="eyebrow">Overview</p>
                            <h2>
                                Welcome back, <span>{displayName}</span>
                            </h2>
                            <div className="meta-row">
                                <span className="meta-badge">Role: {primaryRole}</span>
                                <span className="meta-badge">Status: Active</span>
                            </div>
                        </section>

                        <div className="card-container">
                            <Card title="Users" value={String(userCount)} />
                            <Card title="Your Role" value={primaryRole} />
                            <Card title="Status" value="Active" />
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default Dashboard;
