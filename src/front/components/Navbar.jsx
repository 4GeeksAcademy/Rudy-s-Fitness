import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

export const Navbar = () => {
	const { isAuthenticated, userType, membershipLevel, logout } = useAuth();
	return (
		<nav className="navbar navbar-dark bg-black p-0" style={{ height: "150px" }}>
			<div className="container-fluid px-0 h-100">
				<div className="d-flex w-100 h-100 align-items-stretch justify-content-between gap-0">
					{/* Logo/Banner on the left */}
					<Link to="/" className="navbar-brand mb-0 p-0 d-flex align-items-center h-100" style={{ flex: "1 1 auto", overflow: "hidden" }}>
						<img
							className="w-100 h-100"
							src="https://res.cloudinary.com/dkqtmta6d/image/upload/v1726085814/Rudy_s_Fitness_vg4j9m.png"
							alt="Rudy's Fitness Banner"
							style={{ objectFit: "cover", objectPosition: "left -15px" }}
						/>
					</Link>

					{/* Buttons stacked vertically on the right */}
					<div
						className={`d-flex flex-column gap-1 align-items-stretch justify-content-start px-1 py-1 navbar-btn-col${isAuthenticated ? ' navbar-btn-col-auth' : ''}`}
						style={{
							flex: "0 0 auto",
							width: isAuthenticated ? "140px" : "200px",
							backgroundColor: "#000",
							overflowY: "auto",
							maxHeight: "100%",
						}}
					>
						{!isAuthenticated ? (
							<>
								<Link to="/login" className="btn btn-outline-light btn-sm px-2 py-1 nav-button" style={{ fontSize: "0.8rem", fontWeight: "600" }}>
									<i className="fas fa-sign-in-alt me-2"></i>Login
								</Link>
								<Link to="/registration" className="btn btn-outline-light btn-sm px-2 py-1 nav-button" style={{ fontSize: "0.8rem", fontWeight: "600" }}>
									<i className="fas fa-user-plus me-2"></i>Registration
								</Link>
								<Link to="/activities" className="btn btn-outline-light btn-sm px-2 py-1 nav-button" style={{ fontSize: "0.8rem", fontWeight: "600" }}>
									<i className="fas fa-running me-2"></i>Activities
								</Link>
								<Link to="/store" className="btn btn-outline-light btn-sm px-2 py-1 nav-button" style={{ fontSize: "0.8rem", fontWeight: "600" }}>
									<i className="fas fa-shopping-cart me-2"></i>Shop
								</Link>
							</>
						) : (
							<>
								<button onClick={logout} className="btn btn-outline-light btn-xs px-1 py-1 nav-button" style={{ fontSize: "0.75rem", fontWeight: "600" }}>
									<i className="fas fa-sign-out-alt me-2"></i>Sign Out
								</button>
								<Link to="/activities" className="btn btn-outline-light btn-xs px-1 py-1 nav-button" style={{ fontSize: "0.75rem", fontWeight: "600" }}>
									<i className="fas fa-running me-2"></i>
									Activities
									{userType === "customer" && (
										<span className="ms-2 badge bg-secondary">Upgrade/Downgrade</span>
									)}
								</Link>
								<Link to="/store" className="btn btn-outline-light btn-xs px-1 py-1 nav-button" style={{ fontSize: "0.75rem", fontWeight: "600" }}>
									<i className="fas fa-shopping-cart me-2"></i>
									Shop
									{userType === "customer" && membershipLevel && (
										<span className="ms-2 badge bg-success">Discount</span>
									)}
								</Link>
								<Link to="/benefits" className="btn btn-outline-light btn-xs px-1 py-1 nav-button" style={{ fontSize: "0.75rem", fontWeight: "600" }}>
									<i className="fas fa-gift me-2"></i>Benefits
								</Link>
								<Link to="/profile" className="btn btn-outline-light btn-xs px-1 py-1 nav-button" style={{ fontSize: "0.75rem", fontWeight: "600" }}>
									<i className="fas fa-user me-2"></i>Profile
								</Link>
								<Link to="/exercises" className="btn btn-outline-light btn-xs px-1 py-1 nav-button" style={{ fontSize: "0.75rem", fontWeight: "600" }}>
									<i className="fas fa-dumbbell me-2"></i>Exercises
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};