from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.agenda import Visita
from app.schemas.agenda import VisitaBase, VisitaOut, VisitaCreate

router = APIRouter(prefix="/visitas", tags=["Visitas"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Listar visitas
@router.get("/", response_model=list[VisitaOut])
def listar_visitas(db: Session = Depends(get_db)):
    return db.query(Visita).all()

# Crear visitas
@router.post("/", response_model=VisitaOut)
def crear_visita(visita: VisitaCreate, db: Session = Depends(get_db)):
    nueva_visita = Visita(**visita.dict())
    db.add(nueva_visita)
    db.commit()
    db.refresh(nueva_visita)
    return nueva_visita

# Obtener visitas
@router.get("/{visita_id}", response_model=VisitaOut)
def obtener_visita(visita_id: int, db: Session = Depends(get_db)):
    visita = db.query(Visita).filter(Visita.id == visita_id).first()
    if not visita:
        raise HTTPException(status_code=404, detail="Visita no encontrada")
    return visita

# Eliminar visitas
@router.delete("/{visita_id}")
def eliminar_visita(visita_id: int, db: Session = Depends(get_db)):
    visita = db.query(Visita).filter(Visita.id == visita_id).first()
    if not visita:
        raise HTTPException(status_code=404, detail="Visita no encontrada")
    db.delete(visita)
    db.commit()
    return {"ok": True}