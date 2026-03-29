from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.cliente import Cliente
from app.models.propiedad import Propiedad
from app.schemas.cliente import ClienteBase, ClienteOut, ClienteUpdate
from app.schemas.propiedad import PropiedadOut

router = APIRouter(prefix="/clientes", tags=["Clientes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
# endpoint para listar todos los clientes
@router.get("/", response_model=list[ClienteOut])
def listar_clientes(db: Session = Depends(get_db)):
    return db.query(Cliente).all()

# endpoint para crear clientes
@router.post("/", response_model=ClienteOut)
def crear_cliente(cliente: ClienteBase, db: Session = Depends(get_db)):
    nuevo = Cliente(**cliente.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

# endpoint para mostrar las propiedades que tiene un cliente
@router.get("/{cliente_id}/propiedades", response_model=list[PropiedadOut])
def propiedades_de_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente:
        return []
    return cliente.propiedades

# endpoint para listar todos los clientes sin propiedades asignadas. Esto permite ver quiénes todavía no tienen ninguna propiedad vinculada.
@router.get("/sin_propiedades", response_model=list[ClienteOut], tags=["Clientes"])
def listar_clientes_sin_propiedades(db: Session = Depends(get_db)):
    clientes = (
        db.query(Cliente)
        .outerjoin(Propiedad, Cliente.id == Propiedad.cliente_id)
        .filter(Propiedad.id == None)
        .all()
    )
    return clientes

# endopoint para editar clientes
@router.put("/{cliente_id}", response_model=ClienteOut, tags=["Clientes"])
def actualizar_cliente(cliente_id: int, cliente_actualizado: ClienteUpdate, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    for campo, valor in cliente_actualizado.dict(exclude_unset=True).items():
        setattr(cliente, campo, valor)
    db.commit()
    db.refresh(cliente)
    return cliente

# endopoint para eliminar clientes
@router.delete("/{cliente_id}", tags=["Clientes"])
def eliminar_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    db.delete(cliente)
    db.commit()
    return {"detail": "Cliente eliminado correctamente"}