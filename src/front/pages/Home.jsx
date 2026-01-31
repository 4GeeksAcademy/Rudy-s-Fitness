import React from "react";
import "../../styles/home.css";

export const Home = () => {
	return (
		<div className="home-container">
			{/* Hero Section */}
			<section className="hero-section">
				<div className="hero-overlay">
					<h1 className="hero-title">TRANSFORM YOUR BODY</h1>
					<p className="hero-subtitle">Join Rudy's Fitness and unleash your potential</p>
					<div className="hero-buttons">
						<button className="btn-primary-home">START YOUR JOURNEY</button>
						<button className="btn-secondary-home">LEARN MORE</button>
					</div>
				</div>
			</section>

			{/* About Section */}
			<section className="about-section">
				<div className="container">
					<h2 className="section-title">WHO WE ARE</h2>
					<div className="about-content">
						<div className="about-text">
							<p>
								At Rudy's Fitness, we believe in pushing boundaries and breaking limits.
								Our state-of-the-art facility in the heart of New York City offers everything
								you need to achieve your fitness goals.
							</p>
							<p>
								Whether you're a beginner or an experienced athlete, our expert coaches
								and comprehensive training programs will guide you every step of the way.
							</p>
						</div>
						<div className="about-stats">
							<div className="stat-item">
								<h3>500+</h3>
								<p>Active Members</p>
							</div>
							<div className="stat-item">
								<h3>15+</h3>
								<p>Expert Coaches</p>
							</div>
							<div className="stat-item">
								<h3>50+</h3>
								<p>Weekly Classes</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section className="services-section">
				<div className="container">
					<h2 className="section-title">OUR SERVICES</h2>
					<div className="services-grid">
						<div className="service-card">
							<div className="service-icon">🏋️</div>
							<h3>STRENGTH TRAINING</h3>
							<p>Build muscle and increase strength with our comprehensive weightlifting programs</p>
						</div>
						<div className="service-card">
							<div className="service-icon">🏃</div>
							<h3>CARDIO CLASSES</h3>
							<p>High-intensity cardio sessions designed to boost endurance and burn calories</p>
						</div>
						<div className="service-card">
							<div className="service-icon">🧘</div>
							<h3>YOGA & FLEXIBILITY</h3>
							<p>Improve flexibility, balance, and mental clarity through guided yoga sessions</p>
						</div>
						<div className="service-card">
							<div className="service-icon">👥</div>
							<h3>PERSONAL TRAINING</h3>
							<p>One-on-one coaching tailored to your specific goals and fitness level</p>
						</div>
					</div>
				</div>
			</section>

			{/* Gallery Section */}
			<section className="gallery-section">
				<div className="container">
					<h2 className="section-title">OUR FACILITY</h2>
					<div className="gallery-grid">
						<div className="gallery-item gallery-item-1">
							<div className="gallery-overlay">Equipment Zone</div>
						</div>
						<div className="gallery-item gallery-item-2">
							<div className="gallery-overlay">Training Area</div>
						</div>
						<div className="gallery-item gallery-item-3">
							<div className="gallery-overlay">Group Classes</div>
						</div>
						<div className="gallery-item gallery-item-4">
							<div className="gallery-overlay">Cardio Section</div>
						</div>
					</div>
				</div>
			</section>

			{/* Operation Hours Section */}
			<section className="hours-section">
				<div className="container">
					<h2 className="section-title">OPERATION HOURS</h2>
					<div className="hours-content">
						<div className="hours-block">
							<h3>WEEKDAYS</h3>
							<p className="hours-time">Monday - Friday</p>
							<p className="hours-detail">5:00 AM - 11:00 PM</p>
						</div>
						<div className="hours-divider"></div>
						<div className="hours-block">
							<h3>WEEKENDS</h3>
							<p className="hours-time">Saturday - Sunday</p>
							<p className="hours-detail">7:00 AM - 9:00 PM</p>
						</div>
					</div>
					<div className="hours-note">
						<p>24/7 Access available for Premium Members</p>
					</div>
				</div>
			</section>

			{/* Contact Section */}
			<section className="contact-section">
				<div className="container">
					<h2 className="section-title">GET IN TOUCH</h2>
					<div className="contact-content">
						<div className="contact-info">
							<div className="contact-item">
								<h4>LOCATION</h4>
								<p>123 Fitness Avenue</p>
								<p>New York, NY 10001</p>
							</div>
							<div className="contact-item">
								<h4>PHONE</h4>
								<p>(555) 123-4567</p>
							</div>
							<div className="contact-item">
								<h4>EMAIL</h4>
								<p>info@rudysfitness.com</p>
							</div>
						</div>
						<div className="social-media">
							<h4>FOLLOW US</h4>
							<div className="social-icons">
								<a href="#" className="social-link">Facebook</a>
								<a href="#" className="social-link">Instagram</a>
								<a href="#" className="social-link">Twitter</a>
								<a href="#" className="social-link">YouTube</a>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}; 