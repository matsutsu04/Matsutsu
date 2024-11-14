import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const StockManagement = () => {
    const navigate = useNavigate(); 
    const [formData, setFormData] = useState({
        productName: '', 
        action: 'add',
        quantity: ''
    });
    const [errors, setErrors] = useState({});
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Load products from local storage on component mount
        const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
        setProducts(storedProducts);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.productName) newErrors.productName = "Product Name is required";
        if (!formData.quantity || isNaN(formData.quantity)) newErrors.quantity = "Valid quantity is required";
        return newErrors;
    };

    const handleUpdateStock = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const product = products.find(p => p.name === formData.productName);

        if (!product) {
            alert("Product not found");
            return;
        }

        const quantityChange = parseInt(formData.quantity);
        const currentDate = new Date().toLocaleString();

        if (formData.action === 'add') {
            product.quantity += quantityChange;
           
            logTransaction(product.name, quantityChange, 'add', currentDate);
        } else if (formData.action === 'deduct') {
            if (product.quantity < quantityChange) {
                alert("Not enough stock to deduct");
                return;
            }
            product.quantity -= quantityChange;
            
            logTransaction(product.name, quantityChange, 'deduct', currentDate);
        }

        // Update the products in local storage
        localStorage.setItem("products", JSON.stringify(products));
        alert('Stock updated successfully');
    };

    const logTransaction = (productName, quantityChanged, action, date) => {
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        transactions.push({ productName, quantityChanged, action, date });
        localStorage.setItem("transactions", JSON.stringify(transactions));
    };

    const handleViewStock = () => {
        navigate('/stock-list'); 
    };

    return (
        <section>
            <h2>Stock Selling or Adding</h2>
            <form onSubmit={handleUpdateStock}>
                <select name="productName" value={formData.productName} onChange={handleChange}>
                    <option value="" disabled>Select Product</option>
                    {products.map(product => (
                        <option key={product.id} value={product.name}>{product.name}</option>
                    ))}
                </select>
                <span className="error-message">{errors.productName}</span>
                <select name="action" value={formData.action} onChange={handleChange}>
                    <option value="add">Add Stock</option>
                    <option value="deduct">Deduct Stock</option>
                </select>
                <input type="number" name="quantity" placeholder="Quantity" required value={formData.quantity} onChange={handleChange} className={errors.quantity ? 'error' : ''} />
                <span className="error-message">{errors.quantity}</span>
                <button type="submit">Update Stock</button>
            </form>
            <button onClick={handleViewStock}>View Stock</button>
        </section>
    );
};

export default StockManagement;