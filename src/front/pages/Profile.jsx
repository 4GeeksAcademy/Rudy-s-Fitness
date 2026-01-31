import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "../../styles/profile.css";

export const Profile = () => {
  const { store, dispatch } = useGlobalReducer();
  const { user, isAuthenticated } = store;
  const [activeTab, setActiveTab] = useState("account");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dateOfBirth: user?.dateOfBirth || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = () => {
    dispatch({
      type: "update_profile",
      payload: formData,
    });
    setEditMode(false);
    alert("Profile updated successfully!");
  };

  const handleUpgradeMembership = (newLevel) => {
    dispatch({
      type: "update_membership",
      payload: newLevel,
    });
    alert(`Membership upgraded to ${newLevel}!`);
  };

  if (!isAuthenticated) {
    return (
      <div className="profile-container">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const membershipLevels = [
    {
      id: "basic",
      name: "BASIC",
      price: "$49/month",
      isCurrentLevel: user?.membershipLevel === "basic",
    },
    {
      id: "premium",
      name: "PREMIUM",
      price: "$99/month",
      isCurrentLevel: user?.membershipLevel === "premium",
    },
    {
      id: "vip",
      name: "VIP",
      price: "$149/month",
      isCurrentLevel: user?.membershipLevel === "vip",
    },
  ];

  return (
    <div className="profile-container">
      {/* Hero Section */}
      <div className="profile-hero">
        <div className="profile-hero-overlay">
          <h1>MY PROFILE</h1>
          <p>Manage your account and preferences</p>
        </div>
      </div>

      {/* Content */}
      <div className="profile-content">
        <div className="profile-wrapper">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="user-card">
              <div className="user-avatar">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </div>
              <h3>{user?.firstName} {user?.lastName}</h3>
              <p className="user-email">{user?.email}</p>
              <span className="membership-badge">
                {user?.membershipLevel?.toUpperCase() || "BASIC"}
              </span>
            </div>

            <nav className="profile-nav">
              <button
                className={`nav-btn ${activeTab === "account" ? "active" : ""}`}
                onClick={() => setActiveTab("account")}
              >
                Account Settings
              </button>
              <button
                className={`nav-btn ${activeTab === "membership" ? "active" : ""}`}
                onClick={() => setActiveTab("membership")}
              >
                Membership
              </button>
              <button
                className={`nav-btn ${activeTab === "preferences" ? "active" : ""}`}
                onClick={() => setActiveTab("preferences")}
              >
                Preferences
              </button>
              <button
                className={`nav-btn ${activeTab === "activity" ? "active" : ""}`}
                onClick={() => setActiveTab("activity")}
              >
                Activity
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="profile-main">
            {/* Account Settings Tab */}
            {activeTab === "account" && (
              <div className="tab-content">
                <div className="section-header">
                  <h2>Account Settings</h2>
                  {!editMode && (
                    <button
                      className="edit-btn"
                      onClick={() => setEditMode(true)}
                    >
                      EDIT
                    </button>
                  )}
                </div>

                <div className="account-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </div>

                  {editMode && (
                    <div className="form-actions">
                      <button
                        className="save-btn"
                        onClick={handleSaveProfile}
                      >
                        SAVE CHANGES
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => setEditMode(false)}
                      >
                        CANCEL
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Membership Tab */}
            {activeTab === "membership" && (
              <div className="tab-content">
                <div className="section-header">
                  <h2>Membership & Billing</h2>
                </div>

                <div className="current-membership-card">
                  <div className="membership-info">
                    <h3>Current Membership</h3>
                    <p className="membership-level">
                      {user?.membershipLevel?.toUpperCase() || "BASIC"}
                    </p>
                    <p className="membership-details">
                      Active since: January 15, 2024
                    </p>
                    <p className="membership-renewal">
                      Next billing date: February 15, 2024
                    </p>
                  </div>
                </div>

                <div className="membership-options">
                  <h3>Upgrade Your Membership</h3>
                  <div className="membership-grid">
                    {membershipLevels.map((level) => (
                      <div
                        key={level.id}
                        className={`membership-option ${level.isCurrentLevel ? "current" : ""
                          }`}
                      >
                        <h4>{level.name}</h4>
                        <p className="price">{level.price}</p>
                        {level.isCurrentLevel ? (
                          <button className="current-btn">Current Plan</button>
                        ) : (
                          <button
                            className="upgrade-option-btn"
                            onClick={() => handleUpgradeMembership(level.id)}
                          >
                            Upgrade to {level.name}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="billing-section">
                  <h3>Billing History</h3>
                  <div className="billing-table">
                    <div className="table-header">
                      <div className="table-col">Date</div>
                      <div className="table-col">Amount</div>
                      <div className="table-col">Plan</div>
                      <div className="table-col">Status</div>
                    </div>
                    <div className="table-row">
                      <div className="table-col">Jan 15, 2024</div>
                      <div className="table-col">$49.00</div>
                      <div className="table-col">Basic</div>
                      <div className="table-col">
                        <span className="status-paid">Paid</span>
                      </div>
                    </div>
                    <div className="table-row">
                      <div className="table-col">Dec 15, 2023</div>
                      <div className="table-col">$49.00</div>
                      <div className="table-col">Basic</div>
                      <div className="table-col">
                        <span className="status-paid">Paid</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="tab-content">
                <div className="section-header">
                  <h2>Preferences</h2>
                </div>

                <div className="preferences-section">
                  <div className="preference-item">
                    <div className="preference-info">
                      <h3>Email Notifications</h3>
                      <p>Receive updates about classes and special offers</p>
                    </div>
                    <div className="toggle-switch">
                      <input type="checkbox" defaultChecked id="email-notif" />
                      <label htmlFor="email-notif"></label>
                    </div>
                  </div>

                  <div className="preference-item">
                    <div className="preference-info">
                      <h3>SMS Notifications</h3>
                      <p>Get text messages for important updates</p>
                    </div>
                    <div className="toggle-switch">
                      <input type="checkbox" id="sms-notif" />
                      <label htmlFor="sms-notif"></label>
                    </div>
                  </div>

                  <div className="preference-item">
                    <div className="preference-info">
                      <h3>Class Reminders</h3>
                      <p>Reminder notifications before your classes</p>
                    </div>
                    <div className="toggle-switch">
                      <input type="checkbox" defaultChecked id="class-remind" />
                      <label htmlFor="class-remind"></label>
                    </div>
                  </div>

                  <div className="preference-item">
                    <div className="preference-info">
                      <h3>Privacy Settings</h3>
                      <p>Make your profile visible to other members</p>
                    </div>
                    <div className="toggle-switch">
                      <input type="checkbox" id="privacy" />
                      <label htmlFor="privacy"></label>
                    </div>
                  </div>
                </div>

                <div className="danger-zone">
                  <h3>Danger Zone</h3>
                  <button className="delete-account-btn">
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <div className="tab-content">
                <div className="section-header">
                  <h2>Activity & Stats</h2>
                </div>

                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Total Workouts</h3>
                    <p className="stat-number">28</p>
                  </div>
                  <div className="stat-card">
                    <h3>This Month</h3>
                    <p className="stat-number">8</p>
                  </div>
                  <div className="stat-card">
                    <h3>This Week</h3>
                    <p className="stat-number">3</p>
                  </div>
                  <div className="stat-card">
                    <h3>Streak</h3>
                    <p className="stat-number">5</p>
                    <p className="stat-subtitle">days</p>
                  </div>
                </div>

                <div className="activity-section">
                  <h3>Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <span className="activity-date">Today</span>
                      <span className="activity-text">Completed "Upper Body" workout</span>
                    </div>
                    <div className="activity-item">
                      <span className="activity-date">Yesterday</span>
                      <span className="activity-text">Attended "HIIT Class" at 6:00 PM</span>
                    </div>
                    <div className="activity-item">
                      <span className="activity-date">2 days ago</span>
                      <span className="activity-text">Completed "Full Body" workout</span>
                    </div>
                    <div className="activity-item">
                      <span className="activity-date">3 days ago</span>
                      <span className="activity-text">Upgraded to Premium membership</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
