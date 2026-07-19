from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.modules.auth.routes import router as auth_router
from backend.app.modules.leads.routes import router as leads_router
# Dynamically register other routers in modular structure
from backend.app.modules.dashboard.routes import router as dashboard_router
from backend.app.modules.clients.routes import router as clients_router
from backend.app.modules.tours.routes import router as tours_router
from backend.app.modules.quotations.routes import router as quotations_router
from backend.app.modules.hotels.routes import router as hotels_router
from backend.app.modules.cities.routes import router as cities_router
from backend.app.modules.agents.routes import router as agents_router
from backend.app.modules.payments.routes import router as payments_router
from backend.app.modules.reports.routes import router as reports_router
from backend.app.modules.settings.routes import router as settings_router
from backend.app.modules.staff.routes import router as staff_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route registrations
app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(dashboard_router, prefix=f"{settings.API_V1_STR}/dashboard", tags=["dashboard"])
app.include_router(leads_router, prefix=f"{settings.API_V1_STR}/leads", tags=["leads"])
app.include_router(clients_router, prefix=f"{settings.API_V1_STR}/clients", tags=["clients"])
app.include_router(tours_router, prefix=f"{settings.API_V1_STR}/tours", tags=["tours"])
app.include_router(quotations_router, prefix=f"{settings.API_V1_STR}/quotations", tags=["quotations"])
app.include_router(hotels_router, prefix=f"{settings.API_V1_STR}/hotels", tags=["hotels"])
app.include_router(cities_router, prefix=f"{settings.API_V1_STR}/cities", tags=["cities"])
app.include_router(agents_router, prefix=f"{settings.API_V1_STR}/agents", tags=["agents"])
app.include_router(payments_router, prefix=f"{settings.API_V1_STR}/payments", tags=["payments"])
app.include_router(reports_router, prefix=f"{settings.API_V1_STR}/reports", tags=["reports"])
app.include_router(settings_router, prefix=f"{settings.API_V1_STR}/settings", tags=["settings"])
app.include_router(staff_router, prefix=f"{settings.API_V1_STR}/staff", tags=["staff"])

@app.get("/")
async def root():
    return {
        "app": settings.PROJECT_NAME,
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs"
    }
