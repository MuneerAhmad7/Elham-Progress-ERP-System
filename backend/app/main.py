from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pathlib import Path
from .config import settings
from .database import engine, Base
from .routers import auth, hr, finance, crm, projects, tasks

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Elham Progress ERP API",
    description="Enterprise Resource Planning System",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(hr.router, prefix="/api/hr", tags=["HR"])
app.include_router(finance.router, prefix="/api/finance", tags=["Finance"])
app.include_router(crm.router, prefix="/api/crm", tags=["CRM"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["Tasks"])

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy", "app": "Elham Progress ERP"}

# Serve frontend
@app.get("/")
async def serve_frontend():
    html_path = Path(__file__).parent.parent / "frontend" / "index.html"
    
    if html_path.exists():
        return FileResponse(html_path)
    
    return {
        "message": "Elham Progress ERP API",
        "docs": "/docs",
        "health": "/health",
        "note": f"HTML file not found at: {html_path}"
    }