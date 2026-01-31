import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();
	const { isAuthenticated, user } = store;

	const handleLogout = () => {
		dispatch({ type: 'logout' });
		navigate('/');
	};

	return (
		<nav className="navbar-custom">
			<Link to="/" className="navbar-image-wrapper">
				<img
					src="https://res.cloudinary.com/dkqtmta6d/image/upload/v1726085814/Rudy_s_Fitness_vg4j9m.png"
					alt="Rudy's Fitness"
					className="navbar-banner"
				/>
			</Link>
			<div className="navbar-buttons">
				{!isAuthenticated ? (
					// Before Login - Navbar
					<>
						<Link to="/login" className="navbar-btn">
							Login
							<span className="btn-subtitle">Customer or Coach</span>
						</Link>
						<Link to="/registration" className="navbar-btn">Registration</Link>
						<Link to="/activities" className="navbar-btn">Activities</Link>
						<Link to="/shop" className="navbar-btn">Shop</Link>
					</>
				) : (
					// After Login - Navbar
					<>
						<Link to="/activities" className="navbar-btn">
							Activities
							{user?.membershipLevel && (
								<span className="btn-subtitle">{user.membershipLevel}</span>
							)}
						</Link>
						<Link to="/shop" className="navbar-btn">
							Shop
							<span className="btn-subtitle">Member Discounts</span>
						</Link>
						<Link to="/benefits" className="navbar-btn">Benefits</Link>
						{user?.userType === 'customer' && (
							<>
								<Link to="/exercises" className="navbar-btn">Exercises</Link>
								<Link to="/my-workouts" className="navbar-btn">My Workouts</Link>
							</>
						)}
						{user?.userType === 'coach' && (
							<Link to="/coach-dashboard" className="navbar-btn">Coach Dashboard</Link>
						)}
						<Link to="/profile" className="navbar-btn">Profile</Link>
						<button onClick={handleLogout} className="navbar-btn navbar-btn-logout navbar-btn-full">
							Sign Out
						</button>
					</>
				)}
			</div>
		</nav>
	);
};
