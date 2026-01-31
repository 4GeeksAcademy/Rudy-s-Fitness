from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)
    full_name: Mapped[str] = mapped_column(String(120), nullable=True)
    user_type: Mapped[str] = mapped_column(
        String(20), nullable=False, default="customer")  # customer | coach
    membership_level: Mapped[str] = mapped_column(
        String(20), nullable=False, default="basic")

    workouts_created = relationship(
        "Workout", back_populates="created_by_user", foreign_keys="Workout.created_by")
    workouts_assigned = relationship(
        "Workout", back_populates="assigned_user", foreign_keys="Workout.assigned_to")
    progress_logs = relationship("Progress", back_populates="user")
    billing_records = relationship("BillingRecord", back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "user_type": self.user_type,
            "membership_level": self.membership_level,
            "is_active": self.is_active,
            # do not serialize the password, its a security breach
        }


class Workout(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    membership_level: Mapped[str] = mapped_column(
        String(20), nullable=False, default="basic")
    created_by: Mapped[int] = mapped_column(
        Integer, ForeignKey("user.id"), nullable=False)
    assigned_to: Mapped[int] = mapped_column(
        Integer, ForeignKey("user.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)

    created_by_user = relationship(
        "User", foreign_keys=[created_by], back_populates="workouts_created")
    assigned_user = relationship(
        "User", foreign_keys=[assigned_to], back_populates="workouts_assigned")
    exercises = relationship(
        "WorkoutExercise", back_populates="workout", cascade="all, delete-orphan")
    progress_logs = relationship("Progress", back_populates="workout")

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "membership_level": self.membership_level,
            "created_by": self.created_by,
            "assigned_to": self.assigned_to,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "exercises": [ex.serialize() for ex in self.exercises]
        }


class WorkoutExercise(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    workout_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("workout.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    wger_exercise_id: Mapped[int] = mapped_column(Integer, nullable=True)
    sets: Mapped[int] = mapped_column(Integer, nullable=True)
    reps: Mapped[int] = mapped_column(Integer, nullable=True)
    weight: Mapped[float] = mapped_column(Float, nullable=True)
    notes: Mapped[str] = mapped_column(Text, nullable=True)

    workout = relationship("Workout", back_populates="exercises")

    def serialize(self):
        return {
            "id": self.id,
            "workout_id": self.workout_id,
            "name": self.name,
            "wger_exercise_id": self.wger_exercise_id,
            "sets": self.sets,
            "reps": self.reps,
            "weight": self.weight,
            "notes": self.notes
        }


class Progress(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("user.id"), nullable=False)
    workout_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("workout.id"), nullable=True)
    exercise_name: Mapped[str] = mapped_column(String(120), nullable=True)
    status: Mapped[str] = mapped_column(
        # pending, completed, skipped
        String(50), nullable=False, default="pending")
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    logged_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="progress_logs")
    workout = relationship("Workout", back_populates="progress_logs")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "workout_id": self.workout_id,
            "exercise_name": self.exercise_name,
            "status": self.status,
            "notes": self.notes,
            "logged_at": self.logged_at.isoformat() if self.logged_at else None
        }


class BillingRecord(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("user.id"), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    status: Mapped[str] = mapped_column(
        String(20), default="pending")  # pending, paid, failed
    description: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="billing_records")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "amount": self.amount,
            "currency": self.currency,
            "status": self.status,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
