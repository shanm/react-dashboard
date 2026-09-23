import { useEffect, useState } from "react";

import Header from "../../components/Header/Header";
import { getUsers } from "../../api/userApi";
import type { User } from "../../types/user";

import "./Users.css";

function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await getUsers();
                setUsers(response);
            } catch {
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    return (
        <div className="users-page">
            <Header title="Users" />

            <main className="page-content">
                {loading ? (
                    <div className="status-panel">
                        <p>Loading users...</p>
                    </div>
                ) : (
                    <section className="user-list-panel">
                        <div className="section-heading">
                            <h2>Team members</h2>
                            <span>{users.length} users</span>
                        </div>

                        {users.length === 0 ? (
                            <div className="empty-state">No users found.</div>
                        ) : (
                            <div className="user-list">
                                {users.map((user) => (
                                    <article key={user.id} className="user-card">
                                        <div className="user-avatar">
                                            {(user.name ?? user.username ?? `User ${user.id}`)
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <div className="user-details">
                                            <h3>{user.name ?? user.username ?? `User ${user.id}`}</h3>
                                            <p>{user.role ?? "User"}</p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}

export default Users;
