import {useState} from 'react';

function UserForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Add Validation logic here
        if (!name.trim() || !email.trim()) {
            alert('Please fill in both name and email fields.');
            return;
        }

        console.log(`Submitted name and email: ${name}, email: ${email}`);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>Name: {name}</div>
            <div>Email: {email}</div>
            <div>
            <label>Name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
            />
            </div>
            <div>
            <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                />
            </div>
            <button type="submit">Add User</button>
        </form>
    );
}

export default UserForm;
