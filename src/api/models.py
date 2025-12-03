from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, Column, Table, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

# Define the association table for the many-to-many relationship between Customers and Events
event_customers = Table('event_customers', db.Model.metadata,
                        Column('customer_id', Integer, ForeignKey(
                            'customer.id'), primary_key=True),
                        Column('event_id', Integer, ForeignKey(
                            'event.id'), primary_key=True)
                        )


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }


class Customer(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    dob: Mapped[str] = mapped_column(String(80), nullable=False)
    address: Mapped[str] = mapped_column(String(80), nullable=False)
    # Define many-to-many relationship with Event model using the event_customers table
    events = relationship(
        'Event', secondary=event_customers, backref='customers')

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "dob": self.dob,
            "address": self.address,
            "events": [event.serialize() for event in self.events]
        }


class Event(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    time: Mapped[str] = mapped_column(String(120), nullable=False)
    date: Mapped[str] = mapped_column(String(120), nullable=False)
    location: Mapped[str] = mapped_column(String(120), nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    photo: Mapped[str] = mapped_column(String(120), nullable=False)
    instructor: Mapped[str] = mapped_column(String(120), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "time": self.time,
            "date": self.date,
            "location": self.location,
            "capacity": self.capacity,
            "signups": len(self.customers) if self.customers else 0,
            "photo": self.photo,
            "instructor": self.instructor
        }
