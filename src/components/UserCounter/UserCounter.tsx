import {useState} from 'react';

function UserCounter() {
    const [users, setUsers] = useState(0);

    const addUser = () => {
        setUsers(users + 1);
    };

    return (
        <div>
            <p>Users: {users}</p>
            <button onClick={addUser}>Add User</button>
        </div>
    );
}

export default UserCounter;
