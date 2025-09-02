from sqlalchemy.orm import Session
import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User CRUD
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Diagram CRUD
def get_diagrams_by_owner(db: Session, owner_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Diagram).filter(models.Diagram.owner_id == owner_id).offset(skip).limit(limit).all()

def get_diagram_by_name(db: Session, owner_id: int, name: str):
    return db.query(models.Diagram).filter(models.Diagram.owner_id == owner_id, models.Diagram.name == name).first()

def create_diagram(db: Session, diagram: schemas.DiagramCreate, owner_id: int):
    db_diagram = models.Diagram(**diagram.dict(), owner_id=owner_id)
    db.add(db_diagram)
    db.commit()
    db.refresh(db_diagram)
    return db_diagram

def update_diagram(db: Session, db_diagram: models.Diagram, diagram_update: schemas.DiagramUpdate):
    update_data = diagram_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_diagram, key, value)
    db.commit()
    db.refresh(db_diagram)
    return db_diagram

def delete_diagram(db: Session, db_diagram: models.Diagram):
    db.delete(db_diagram)
    db.commit()
    return db_diagram
