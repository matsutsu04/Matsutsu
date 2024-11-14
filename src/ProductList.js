import React, { useState, useEffect } from 'react';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: ''
    });

    useEffect(() => {
        fetchProducts(); // Fetch products from the database
    }, []);

    const fetchProducts = () => {
        fetch('http://localhost:5001/api/products')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching products:', error));
    };

    const handleEditClick = (product) => {
        setEditingProduct(product.id);
        setFormData({ ...product }); // Pre-fill the form
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:5001/api/products/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete product. Please try again.');
                }
                setProducts(prev => prev.filter(product => product.id !== id)); // Update state to remove deleted product
                alert('Product deleted successfully');
            } catch (error) {
                console.error('Error deleting product:', error);
                alert(error.message);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5001/api/products/${formData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Failed to update product. Please try again.');
            }
            const updatedProduct = await response.json();
            setProducts(prev => prev.map(product => product.id === updatedProduct.id ? updatedProduct : product));
            alert('Product updated successfully');
            setEditingProduct(null); // Exit edit mode
            setFormData({ id: '', name: '', description: '', category: '', price: '', quantity: '' }); // Reset form
        } catch (error) {
            console.error('Error updating product:', error);
            alert(error.message);
        }
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setFormData({ id: '', name: '', description: '', category: '', price: '', quantity: '' });
    };

    return (
        <section>
            <h2>Total of Products</h2>
            {editingProduct ? (
                <form onSubmit={handleEditSubmit}>
                    <h3>Edit Product</h3>
                    <input type="hidden" name="id" value={formData.id} />
                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                    <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
                    <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
                    <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
                    <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required />
                    <button type="submit">Update Product</button>
                    <button type="button" onClick={handleCancelEdit}>Cancel</button>
                </form>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.category}</td>
                                <td>{product.price}</td>
                                <td>{product.quantity}</td>
                                <td>
                                    <button onClick={() => handleEditClick(product)}>Edit</button>
                                    <button onClick={() => handleDelete(product.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
};

export default ProductList;