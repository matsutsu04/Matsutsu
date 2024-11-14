import React, { useState, useEffect } from 'react';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', idNumber: '', phoneNumber: '', position: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/users'); // Fetch users from the API
                if (!response.ok) {
                    throw new Error('Failed to fetch users. Please check your server.');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setMessage('Error fetching users. Please try again later.');
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (idNumber) => {
        const updatedUsers = users.filter(u => u.idNumber !== idNumber);
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers)); // Optional: Keep local storage in sync
        alert('User deleted successfully');

        // Optionally, you can also delete from the server
        try {
            await fetch(`http://localhost:5000/api/users/${idNumber}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            setMessage('Error deleting user. Please try again later.');
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({ 
            name: user.name, 
            idNumber: user.idNumber, 
            phoneNumber: user.phoneNumber, 
            position: user.position 
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedUsers = users.map(user => 
            user.idNumber === editingUser.idNumber ? { ...user, ...formData } : user
        );
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers)); // Optional: Keep local storage in sync
        setEditingUser(null); // Close the edit form
        alert('User updated successfully');

        // Optionally, you can also update the user on the server
        try {
            await fetch(`http://localhost:5000/api/users/${editingUser.idNumber}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
        } catch (error) {
            console.error('Error updating user:', error);
            setMessage('Error updating user. Please try again later.');
        }
    };

    const handleCancelEdit = () => {
        setEditingUser(null); // Cancel editing
    };

    return (
        <section>
            <h2>Total of Users</h2>
            {message && <p className="message">{message}</p>} {/* Display messages */}
            {editingUser ? (
                <form onSubmit={handleSubmit}>
                    <h3>Edit User</h3>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                    <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} placeholder="ID Number" required disabled />
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />
                    <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Position" required />
                    <button type="submit">Save</button>
                    <button type="button" onClick={handleCancelEdit}>Cancel</button>
                </form>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>ID Number</th>
                            <th>Phone Number</th>
                            <th>Position</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.idNumber}>
                                <td>{user.name}</td>
                                <td>{user.idNumber}</td>
                                <td>{user.phoneNumber}</td>
                                <td>{user.position}</td>
                                <td>
                                    <button onClick={() => handleEdit(user)}>Edit</button>
                                    <button onClick={() => handleDelete(user.idNumber)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
};

export default UserList;