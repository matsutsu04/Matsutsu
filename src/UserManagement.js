import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
    const navigate = useNavigate(); // Use useNavigate hook
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        position: '',
        idNumber: '',
        phoneNumber: ''
    });
    const [errors, setErrors] = useState({}); // Track errors

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' })); // Clear error message
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = "Username is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (!formData.position) newErrors.position = "Position is required";
        if (!formData.idNumber) newErrors.idNumber = "ID Number is required";
        if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        fetch('http://localhost:5000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            alert('User added successfully');
            setFormData({ username: '', password: '', position: '', idNumber: '', phoneNumber: '' });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const handleViewUsers = () => {
        navigate('/user-list');
    };

    return (
        <section>
            <h2>User Management</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" required value={formData.username} onChange={handleChange} className={errors.username ? 'error' : ''} />
                <span className="error-message">{errors.username}</span>
                <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} className={errors.password ? 'error' : ''} />
                <span className="error-message">{errors.password}</span>
                <input type="text" name="position" placeholder="Position" required value={formData.position} onChange={handleChange} className={errors.position ? 'error' : ''} />
                <span className="error-message">{errors.position}</span>
                <input type="text" name="idNumber" placeholder="ID Number" required value={formData.idNumber} onChange={handleChange} className={errors.idNumber ? 'error' : ''} />
                <span className="error-message">{errors.idNumber}</span>
                <input type="text" name="phoneNumber" placeholder="Phone Number" required value={formData.phoneNumber} onChange={handleChange} className={errors.phoneNumber ? 'error' : ''} />
                <span className="error-message">{errors.phoneNumber}</span>
                <button type="submit">Add User</button>
            </form>
            <button onClick={handleViewUsers}>View Users</button>
        </section>
    );
};

export default UserManagement;