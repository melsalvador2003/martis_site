# Backend Martis - API FastAPI

Esta é a API oficial de lista de espera da **Martis**. Foi construída com **FastAPI**, **SQLAlchemy** e **SQLite** para persistência, pronta para ser disponibilizada de forma simples e gratuita no **Render**.

## 🚀 Como Executar Localmente

### Pré-requisitos
- Python 3.10 ou superior instalado.

### Passo a Passo

1. **Navegue até a pasta do backend:**
   ```bash
   cd backend
   ```

2. **Crie um ambiente virtual (venv):**
   ```bash
   python -m venv venv
   ```

3. **Ative o ambiente virtual:**
   - No Linux/MacOS:
     ```bash
     source venv/bin/activate
     ```
   - No Windows:
     ```bash
     venv\Scripts\activate
     ```

4. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Execute a aplicação:**
   ```bash
   uvicorn main:app --reload
   ```

6. **Acesse as URLs:**
   - **Documentação de Teste Interativa (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)
   - **JSON Schema:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## ☁️ Instruções de Deploy no Render (render.com)

O **Render** é o ambiente ideal para hospedar esta API gratuitamente:

1. **Repositório:** Envie este repositório para a sua conta do GitHub ou GitLab.
2. **Criação do Serviço no Render:**
   - Faça login em [dashboard.render.com](https://dashboard.render.com).
   - Clique em **"New"** -> **"Web Service"**.
   - Conecte o repositório git correspondente.
3. **Configurações do Web Service:**
   - **Name:** `martis-backend` (ou de sua preferência)
   - **Environment / Runtime:** `Python 3`
   - **Branch:** `main` (ou a branch principal que você utilizou)
   - **Root Directory:** `backend` (importante! Escolha para que o Render entenda que o código está dentro de `/backend`)
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan Type:** `Free` (sem custos)
4. **Variáveis de Ambiente (opcional):**
   - O Render gerencia a porta automaticamento por `$PORT`.
5. **Acesso:** Assim que o build for concluído, o Render gerará uma URL pública (ex.: `https://martis-backend.onrender.com`).
   - Acesse `https://martis-backend.onrender.com/docs` para validar se tudo está online e testar.
