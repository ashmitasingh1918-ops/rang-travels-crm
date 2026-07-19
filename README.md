# Rang Travels CRM

Rang Travels CRM is a production-ready, industry-grade customer relationship management system specifically built for tour operators, travel agencies, and hotel coordinators. 

The architecture is built layout-first to facilitate multi-developer workflows, with a separated React/Vite front-end client and a FastAPI asynchronous microservice back-end engine.

---

## Features

- **Leads Pipeline**: Track, qualify, and convert incoming tours leads.
- **Tour Generation**: Create unique, system-standardized Tour IDs using region specific codes.
- **B2B Hotel Integrations**: Send dynamic, templated request e-mails to hoteliers containing PDF tour quotations.
- **SQLAlchemy 2.0 Async Core**: High-throughput database sessions supporting high concurrency.
- **JWT Refresh Tokens**: Rotation validation mechanism for security safety.

---

## Workspace Structure

```
rang-travels-crm/
├── frontend/             # React + Vite client (Tailwind CSS, Zustand, Axios interceptors)
├── backend/              # FastAPI server (SQLAlchemy 2.0, Alembic, uvicorn async)
├── docs/                 # System Architecture & Documentation manuals
├── docker-compose.yml    # Development system database servers (Postgres + Redis)
└── README.md             # Developer handbook onboarding manual
```

For setup instructions, guidelines, and specifications, refer to [UserGuide.md](./docs/UserGuide.md) inside the `docs/` manual directory.
