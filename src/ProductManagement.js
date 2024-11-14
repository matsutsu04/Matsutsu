import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductManagement = ({ productToEdit, onEditComplete }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: ''
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name,
                description: productToEdit.description,
                category: productToEdit.category,
                price: productToEdit.price,
                quantity: productToEdit.quantity
            });
        }
    }, [productToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
        setMessage('');
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "product name is required";
        if (!formData.description) newErrors.description = "Description is required";
        if (!formData.category) newErrors.category = "Category is required";
        if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
            newErrors.price = "Valid price is required";
        }
        if (!formData.quantity || isNaN(formData.quantity) || parseInt(formData.quantity) <= 0) {
            newErrors.quantity = "Valid Quantity is required";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const method = productToEdit ? 'PUT' : 'POST';
            const url = productToEdit ? `http://localhost:5001/api/products/${productToEdit.id}` : 'http://localhost:5000/api/products';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    category: formData.category,
                    price: parseFloat(formData.price),
                    quantity: parseInt(formData.quantity)
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setMessage(`Product ${productToEdit ? 'updated' : 'added'} successfully: ${data.name}`);

            // Update local storage with the new product
            const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
            if (productToEdit) {
                const index = storedProducts.findIndex(p => p.id === productToEdit.id);
                storedProducts[index] = data; // Update existing product
            } else {
                storedProducts.push(data); // Add new product
            }
            localStorage.setItem("products", JSON.stringify(storedProducts));

            setFormData({ name: '', description: '', category: '', price: '', quantity: '' });
            onEditComplete(); // Notify parent component to reset editing state
        } catch (error) {
            console.error(error);
            setMessage(`Error ${productToEdit ? 'updating' : 'adding'} product: ${error.message}`);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch(`http://localhost:5001/api/products/${productToEdit.id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                // Remove the deleted product from local storage
                const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
                const updatedProducts = storedProducts.filter(p => p.id !== productToEdit.id);
                localStorage.setItem("products", JSON.stringify(updatedProducts));

                setMessage(`Product deleted successfully: ${productToEdit.name}`);
                onEditComplete(); // Notify parent component to reset editing state
            } catch (error) {
                console.error('Error deleting product:', error);
                setMessage(`Error deleting product: ${error.message}`);
            }
        }
    };

    return (
        <section>
            <h2>{productToEdit ? 'Edit Product' : 'product Management'}</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Product Name" 
                    required 
                    value={formData.name} 
                    onChange={handleChange} 
                />
                <span className="error-message">{errors.name}</span>
                
                <input 
                    type="text" 
                    name="description" 
                    placeholder="Product Description" 
                    required 
                    value={formData.description} 
                    onChange={handleChange} 
                />
                <span className="error-message">{errors.description}</span>
                
                <input 
                    type="text" 
                    name="category" 
                    placeholder="Product Category" 
                    required 
                    value={formData.category} 
                    onChange={handleChange} 
                />
                <span className="error-message">{errors.category}</span>

                <input 
                    type="number" 
                    name="price" 
                    placeholder="Product Price" 
                    required 
                    value={formData.price} 
                    onChange={handleChange} 
                />
                <span className="error-message">{errors.price}</span>
                
                <input 
                    type="number" 
                    name="quantity" 
                    placeholder="Product Quantity" 
                    required 
                    value={formData.quantity} 
                    onChange={handleChange} 
                />
                <span className="error-message">{errors.quantity}</span>

                <button type="submit">{productToEdit ? 'Update Product' : 'Add Product'}</button>
                {productToEdit && (
                    <button type="button" onClick={handleDelete}>Delete Product</button>
                )}
            </form>
            {message && <p className="message">{message}</p>}
            <Link to="/product-list">
                <button>View Products</button>
            </Link>
        </section>
    );
};

export default ProductManagement;