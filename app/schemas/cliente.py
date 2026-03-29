from pydantic import BaseModel, EmailStr
from typing import Optional

class ClienteBase(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr  # valida formato de email automáticamente
    telefono: str | None = None

class ClienteOut(ClienteBase):
    id: int
    class Config:
        from_attributes = True
        #orm_mode = True

class ClienteCreate(ClienteBase):
    pass

# 👇 Nuevo esquema para actualización
class ClienteUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    email: Optional[str] = None
    telefono: Optional[str] = None
    
