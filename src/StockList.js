import React, { useEffect, useState } from 'react';

const StockList = ({ onEdit }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts(); 
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/products');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch(`http://localhost:5001/api/products/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                
                setProducts(products.filter(product => product.id !== id));
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    return (
        <section>
            <h2>Total Stock</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Stock Level</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.quantity}</td>
                            <td>{product.quantity < 5 ? "Low Stock" : "Available"}</td>
                            <td>
                                <button onClick={() => onEdit(product)}>Edit</button>
                                <button onClick={() => handleDelete(product.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
};

export default StockList;