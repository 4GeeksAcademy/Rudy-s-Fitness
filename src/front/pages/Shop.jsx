import React, { useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "../../styles/shop.css";

export const Shop = () => {
    const { store } = useGlobalReducer();
    const { isAuthenticated, user } = store;
    const [cart, setCart] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Discount rates based on membership
    const discounts = {
        basic: 0,
        premium: 0.10,
        vip: 0.20
    };

    const discount = isAuthenticated ? discounts[user?.membershipLevel] || 0 : 0;

    const products = [
        {
            id: 1,
            name: "PREMIUM PROTEIN POWDER",
            category: "Supplements",
            price: 59.99,
            description: "25g protein per serving, helps build lean muscle mass",
            image: "https://images.unsplash.com/photo-1579722821273-0f6c7d6d6f8e?w=400",
            stock: 50
        },
        {
            id: 2,
            name: "RESISTANCE BANDS SET",
            category: "Equipment",
            price: 29.99,
            description: "5-piece set with varying resistance levels for full-body workouts",
            image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400",
            stock: 30
        },
        {
            id: 3,
            name: "YOGA MAT PRO",
            category: "Equipment",
            price: 49.99,
            description: "Extra thick, non-slip surface for maximum comfort",
            image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
            stock: 45
        },
        {
            id: 4,
            name: "PRE-WORKOUT ENERGY",
            category: "Supplements",
            price: 39.99,
            description: "Boost energy and focus for intense training sessions",
            image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400",
            stock: 60
        },
        {
            id: 5,
            name: "LIFTING GLOVES",
            category: "Accessories",
            price: 24.99,
            description: "Premium grip and wrist support for heavy lifts",
            image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400",
            stock: 40
        },
        {
            id: 6,
            name: "GYM DUFFLE BAG",
            category: "Accessories",
            price: 69.99,
            description: "Spacious, waterproof bag with multiple compartments",
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
            stock: 25
        },
        {
            id: 7,
            name: "SHAKER BOTTLE",
            category: "Accessories",
            price: 14.99,
            description: "Leak-proof design with built-in mixer",
            image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400",
            stock: 100
        },
        {
            id: 8,
            name: "RECOVERY FOAM ROLLER",
            category: "Equipment",
            price: 34.99,
            description: "Deep tissue massage for muscle recovery",
            image: "https://images.unsplash.com/photo-1611016186353-70d97c1a7fe4?w=400",
            stock: 35
        },
        {
            id: 9,
            name: "BCAA AMINO ACIDS",
            category: "Supplements",
            price: 44.99,
            description: "Support muscle recovery and reduce fatigue",
            image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400",
            stock: 55
        }
    ];

    const getDiscountedPrice = (price) => {
        return (price * (1 - discount)).toFixed(2);
    };

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, change) => {
        setCart(cart.map(item => {
            if (item.id === productId) {
                const newQuantity = item.quantity + change;
                return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const getCartTotal = () => {
        const subtotal = cart.reduce((total, item) => {
            const price = isAuthenticated ? parseFloat(getDiscountedPrice(item.price)) : item.price;
            return total + (price * item.quantity);
        }, 0);
        return subtotal.toFixed(2);
    };

    const getSavings = () => {
        const originalTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const discountedTotal = parseFloat(getCartTotal());
        return (originalTotal - discountedTotal).toFixed(2);
    };

    return (
        <div className="shop-container">
            {/* Hero Section */}
            <section className="shop-hero">
                <div className="shop-hero-overlay">
                    <h1 className="shop-hero-title">RUDY'S FITNESS SHOP</h1>
                    <p className="shop-hero-subtitle">
                        {isAuthenticated
                            ? `${user?.membershipLevel?.toUpperCase()} MEMBER - ${(discount * 100).toFixed(0)}% OFF ALL PRODUCTS`
                            : "Premium fitness gear and supplements"}
                    </p>
                </div>
            </section>

            {!isAuthenticated && (
                <div className="member-discount-banner">
                    <div className="container">
                        <h3>🎁 MEMBERS GET EXCLUSIVE DISCOUNTS!</h3>
                        <p>Premium members get 10% off | VIP members get 20% off</p>
                        <Link to="/registration" className="banner-btn">BECOME A MEMBER</Link>
                    </div>
                </div>
            )}

            {isAuthenticated && discount > 0 && (
                <div className="active-discount-banner">
                    <div className="container">
                        <h3>💪 YOUR {(discount * 100).toFixed(0)}% MEMBER DISCOUNT IS ACTIVE!</h3>
                        <p>Savings applied automatically at checkout</p>
                    </div>
                </div>
            )}

            <div className="shop-layout">
                {/* Products Section */}
                <section className="products-section">
                    <div className="container">
                        <h2 className="section-title">ALL PRODUCTS</h2>
                        <div className="products-grid">
                            {products.map((product) => {
                                const hasDiscount = isAuthenticated && discount > 0;
                                const finalPrice = hasDiscount
                                    ? getDiscountedPrice(product.price)
                                    : product.price.toFixed(2);
                                const originalPrice = product.price.toFixed(2);

                                return (
                                    <div key={product.id} className="product-card">
                                        <div
                                            className="product-image"
                                            style={{ backgroundImage: `url(${product.image})` }}
                                            onClick={() => setSelectedProduct(product)}
                                        >
                                            {hasDiscount && (
                                                <div className="discount-badge">
                                                    -{(discount * 100).toFixed(0)}%
                                                </div>
                                            )}
                                            <div className="category-badge">{product.category}</div>
                                        </div>
                                        <div className="product-content">
                                            <h3>{product.name}</h3>
                                            <p className="product-description">{product.description}</p>
                                            <div className="product-footer">
                                                <div className="product-price">
                                                    {hasDiscount && (
                                                        <span className="original-price">${originalPrice}</span>
                                                    )}
                                                    <span className="final-price">${finalPrice}</span>
                                                </div>
                                                <button
                                                    className="add-to-cart-btn"
                                                    onClick={() => addToCart(product)}
                                                >
                                                    ADD TO CART
                                                </button>
                                            </div>
                                            <div className="stock-info">
                                                {product.stock > 10 ? (
                                                    <span className="in-stock">✓ In Stock</span>
                                                ) : product.stock > 0 ? (
                                                    <span className="low-stock">⚠ Only {product.stock} left</span>
                                                ) : (
                                                    <span className="out-of-stock">✗ Out of Stock</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Shopping Cart Sidebar */}
                {cart.length > 0 && (
                    <div className="cart-sidebar">
                        <div className="cart-header">
                            <h3>SHOPPING CART</h3>
                            <span className="cart-count">{cart.length} items</span>
                        </div>
                        <div className="cart-items">
                            {cart.map((item) => {
                                const itemPrice = isAuthenticated
                                    ? parseFloat(getDiscountedPrice(item.price))
                                    : item.price;

                                return (
                                    <div key={item.id} className="cart-item">
                                        <div className="cart-item-info">
                                            <h4>{item.name}</h4>
                                            <p>${itemPrice.toFixed(2)} each</p>
                                        </div>
                                        <div className="cart-item-controls">
                                            <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                        </div>
                                        <div className="cart-item-total">
                                            ${(itemPrice * item.quantity).toFixed(2)}
                                        </div>
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        {isAuthenticated && discount > 0 && (
                            <div className="cart-savings">
                                <span>Member Savings:</span>
                                <span className="savings-amount">-${getSavings()}</span>
                            </div>
                        )}
                        <div className="cart-total">
                            <span>Total:</span>
                            <span className="total-amount">${getCartTotal()}</span>
                        </div>
                        <button className="checkout-btn">PROCEED TO CHECKOUT</button>
                    </div>
                )}
            </div>

            {/* Product Details Modal */}
            {selectedProduct && (
                <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
                    <div className="modal-content shop-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedProduct(null)}>✕</button>
                        <div className="modal-grid">
                            <img src={selectedProduct.image} alt={selectedProduct.name} className="modal-product-image" />
                            <div className="modal-product-info">
                                <div className="modal-category">{selectedProduct.category}</div>
                                <h2>{selectedProduct.name}</h2>
                                <p className="modal-product-description">{selectedProduct.description}</p>
                                <div className="modal-price">
                                    {isAuthenticated && discount > 0 && (
                                        <span className="modal-original-price">${selectedProduct.price.toFixed(2)}</span>
                                    )}
                                    <span className="modal-final-price">
                                        ${getDiscountedPrice(selectedProduct.price)}
                                    </span>
                                    {isAuthenticated && discount > 0 && (
                                        <span className="modal-savings">💰 Save ${(selectedProduct.price * discount).toFixed(2)}</span>
                                    )}
                                </div>
                                <div className="modal-stock">
                                    Stock: {selectedProduct.stock} units available
                                </div>
                                <button
                                    className="modal-add-btn"
                                    onClick={() => {
                                        addToCart(selectedProduct);
                                        setSelectedProduct(null);
                                    }}
                                >
                                    ADD TO CART
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
