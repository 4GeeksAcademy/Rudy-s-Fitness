import React, { Component } from "react";
import { Link } from "react-router-dom";
export const Footer = () => (
	<footer className="footer mt-auto py-4 text-center bg-black">
		<div className="container">
			<div className="row g-4">
				<div className="col-md-6 d-flex flex-column align-items-center">
					<h4 className="text-white mb-3">
						Quick Links
					</h4>
					<Link to="/logincustomer" className="btn text-white fw-bold mb-2">Login Customer</Link>
					<Link to="/loginuser" className="btn text-white fw-bold mb-2">Login User</Link>
					<Link to="/signupcustomer" className="btn text-white fw-bold mb-2">Signup Customer</Link>
					<Link to="/create-event" className="btn text-white fw-bold mb-2">Create Event</Link>
				</div>
				<div className="col-md-6 d-flex flex-column align-items-center">
					<h4 className="text-white mb-3">
						Social Media
					</h4>
					<a href="https://www.facebook.com/" className="btn text-white fw-bold mb-2">Facebook</a>
					<a href="https://www.instagram.com/stories/daking_alm26/" className="btn text-white fw-bold mb-2">Instagram</a>
					<a href="https://x.com/AlexMartinboro1" className="btn text-white fw-bold mb-2">X</a>
					<a href="https://www.linkedin.com/in/alex-martinborough-51830323/" className="btn text-white fw-bold mb-2">Linkedin</a>
				</div>
			</div>
			<div className="row mt-4">
				<div className="col">
					<p className="text-white mb-0">
						Made with <i className="fa fa-heart text-danger" /> by{" "}
						<a href="http://www.4geeksacademy.com" className="text-white text-decoration-none">Rudy's Fitness</a>
					</p>
				</div>
			</div>
		</div>
	</footer>
);

