from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Diagram Schemas
class DiagramBase(BaseModel):
    name: str
    xml_script: Optional[str] = None
    mermaid_script: Optional[str] = None

class DiagramCreate(DiagramBase):
    pass

class DiagramUpdate(DiagramBase):
    pass

class Diagram(DiagramBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# User Schemas
class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    diagrams: List[Diagram] = []

    class Config:
        orm_mode = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
