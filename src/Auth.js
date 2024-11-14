import React, { useState, useEffect } from 'react';

const Auth = ({ onLogin }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        position: '',
        idNumber: '',
        phoneNumber: ''
    });
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch users from the server
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true); 
            try {
                const response = await fetch('http://localhost:5000/api/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch users. Please check your server.');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setMessage('Error fetching users. Please ensure your server is running and try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // Validate input fields
    const validate = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = "Username is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (isSignUp) {
            if (!formData.position) newErrors.position = "Position is required";
            if (!formData.idNumber) newErrors.idNumber = "ID Number is required";
            if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required";
        }
        return newErrors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (isSignUp) {
            try {
                const response = await fetch('http://localhost:5000/api/users', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to sign up. Please check your input and try again.');
                }

                const data = await response.json();
                console.log("Sign up successful", data);
                setMessage('Sign up successful! You can now log in.');
                setIsSignUp(false); // Switch to login mode
                setFormData({
                    username: '',
                    password: '',
                    position: '',
                    idNumber: '',
                    phoneNumber: ''
                }); // Clear form fields
            } catch (err) {
                console.error('Sign up error:', err);
                setMessage(err.message);
            }
        } else {
            // Login logic
            try {
                const response = await fetch('http://localhost:5000/api/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch users for login.');
                }

                const allUsers = await response.json();
                const user = allUsers.find(u => u.username === formData.username && u.password === formData.password);
                if (user) {
                    onLogin(); // Call the onLogin prop function on successful login
                } else {
                    alert('Invalid username or password');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('An error occurred during login, please try again later.');
            }
        }
    };

    return (
        <section>
            <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
            {loading ? ( // Show loading message
                <p>Loading users...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input type="text" name="username" placeholder="Username" required value={formData.username} onChange={handleChange} className={errors.username ? 'error' : ''} />
                    <span className="error-message">{errors.username}</span>
                    
                    <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} className={errors.password ? 'error' : ''} />
                    <span className="error-message">{errors.password}</span>
                    
                    {isSignUp && (
                        <>
                            <input type="text" name="position" placeholder="Position" required value={formData.position} onChange={handleChange} className={errors.position ? 'error' : ''} />
                            <span className="error-message">{errors.position}</span>
                            
                            <input type="text" name="idNumber" placeholder="ID Number" required value={formData.idNumber} onChange={handleChange} className={errors.idNumber ? 'error' : ''} />
                            <span className="error-message">{errors.idNumber}</span>
                            
                            <input type="text" name="phoneNumber" placeholder="Phone Number" required value={formData.phoneNumber} onChange={handleChange} className={errors.phoneNumber ? 'error' : ''} />
                            <span className="error-message">{errors.phoneNumber}</span>
                        </>
                    )}
                    
                    <button type="submit">{isSignUp ? "Create Account" : "Login"}</button>
                    
                    <p>
                        {isSignUp ? "Already have an account? " : "Don't have an account? "}
                        <button type="button" onClick={() => setIsSignUp(!isSignUp)}>{isSignUp ? "Login" : "Sign Up"}</button>
                    </p>
                    {message && <p className="message">{message}</p>}
                </form>
            )}
        </section>
    );
};

export default Auth;