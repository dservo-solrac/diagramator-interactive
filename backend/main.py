from fastapi import APIRouter, Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from jose import jwt, JWTError

import crud, models, schemas, security
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
router = APIRouter()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create default admin user on startup
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    admin_user = crud.get_user_by_email(db, email="admin@example.com")
    if not admin_user:
        crud.create_user(db, user=schemas.UserCreate(email="admin@example.com", password="admin"))
    db.close()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = security.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@router.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user

@router.get("/diagrams/", response_model=List[schemas.Diagram])
def read_diagrams(skip: int = 0, limit: int = 100, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    diagrams = crud.get_diagrams_by_owner(db, owner_id=current_user.id, skip=skip, limit=limit)
    return diagrams

@router.post("/diagrams/", response_model=schemas.Diagram)
def create_diagram(diagram: schemas.DiagramCreate, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_diagram = crud.get_diagram_by_name(db, owner_id=current_user.id, name=diagram.name)
    if db_diagram:
        raise HTTPException(status_code=400, detail="Diagram name already exists")
    return crud.create_diagram(db=db, diagram=diagram, owner_id=current_user.id)

@router.put("/diagrams/{diagram_id}", response_model=schemas.Diagram)
def update_diagram(diagram_id: int, diagram_update: schemas.DiagramUpdate, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_diagram = db.query(models.Diagram).filter(models.Diagram.id == diagram_id, models.Diagram.owner_id == current_user.id).first()
    if not db_diagram:
        raise HTTPException(status_code=404, detail="Diagram not found")
    return crud.update_diagram(db=db, db_diagram=db_diagram, diagram_update=diagram_update)

@router.delete("/diagrams/{diagram_id}", response_model=schemas.Diagram)
def delete_diagram(diagram_id: int, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_diagram = db.query(models.Diagram).filter(models.Diagram.id == diagram_id, models.Diagram.owner_id == current_user.id).first()
    if not db_diagram:
        raise HTTPException(status_code=404, detail="Diagram not found")
    return crud.delete_diagram(db=db, db_diagram=db_diagram)

app.include_router(router, prefix="/api")
