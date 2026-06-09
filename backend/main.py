from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import List
from datetime import datetime

from .database import engine, Base, get_db
from .models import WaitlistEmail

# Criar tabelas do banco de dados ao iniciar
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Martis Waitlist API",
    description="API para gerenciar cadastros de lista de espera para a startup Martis OS",
    version="1.0.0"
)

# Configurar CORS para o frontend (e.g. Render, localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique as URLs reais do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Schemas Pydantic
class WaitlistBase(BaseModel):
    nome: str
    email: EmailStr

class WaitlistCreate(WaitlistBase):
    pass

class WaitlistUpdate(BaseModel):
    nome: str | None = None
    email: EmailStr | None = None

class WaitlistResponse(WaitlistBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Endpoints

@app.get("/waitlist", response_model=List[WaitlistResponse])
def get_waitlist(db: Session = Depends(get_db)):
    """
    Retorna toda a lista de contatos inscritos na lista de espera.
    """
    return db.query(WaitlistEmail).all()


@app.post("/waitlist", response_model=WaitlistResponse, status_code=status.HTTP_201_CREATED)
def add_to_waitlist(contact: WaitlistCreate, db: Session = Depends(get_db)):
    """
    Adiciona um novo e-mail e nome à lista de espera.
    Retorna erro 400 se o e-mail já estiver cadastrado.
    """
    existing = db.query(WaitlistEmail).filter(WaitlistEmail.email == contact.email).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Este e-mail já está cadastrado na lista de espera."
        )
    
    db_contact = WaitlistEmail(nome=contact.nome, email=contact.email)
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact


@app.put("/waitlist/{id}", response_model=WaitlistResponse)
def update_waitlist(id: int, contact_update: WaitlistUpdate, db: Session = Depends(get_db)):
    """
    Atualiza um registro da lista de espera pelo ID.
    """
    db_contact = db.query(WaitlistEmail).filter(WaitlistEmail.id == id).first()
    if not db_contact:
        raise HTTPException(
            status_code=404,
            detail="Registro não encontrado."
        )
    
    if contact_update.nome is not None:
        db_contact.nome = contact_update.nome
    
    if contact_update.email is not None:
        # Verificar se outro e-mail conflita
        conflit = db.query(WaitlistEmail).filter(
            WaitlistEmail.email == contact_update.email, 
            WaitlistEmail.id != id
        ).first()
        if conflit:
            raise HTTPException(
                status_code=400,
                detail="Este e-mail já está em uso por outro cadastro."
            )
        db_contact.email = contact_update.email
        
    db.commit()
    db.refresh(db_contact)
    return db_contact


@app.delete("/waitlist/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_from_waitlist(id: int, db: Session = Depends(get_db)):
    """
    Remove um e-mail cadastrado pelo ID.
    """
    db_contact = db.query(WaitlistEmail).filter(WaitlistEmail.id == id).first()
    if not db_contact:
        raise HTTPException(
            status_code=404,
            detail="Registro não encontrado."
        )
    
    db.delete(db_contact)
    db.commit()
    return None
