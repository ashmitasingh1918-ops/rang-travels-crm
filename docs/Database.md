# Rang Travels CRM - Database Architecture

The CRM leverages a relational structure in PostgreSQL. Object relational mapping is structured via SQLAlchemy 2.0.

```mermaid
erDiagram
    Lead {
        int id PK
        string client_name
        string email
        string phone
        string destination
        string status
        text notes
        datetime created_at
        datetime updated_at
    }
    Client {
        int id PK
        string first_name
        string last_name
        string email
        string phone
        datetime created_at
    }
    Tour {
        int id PK
        string tour_id UK
        int client_id FK
        string destination_code
        string status
        datetime start_date
        datetime end_date
    }
    Quotation {
        int id PK
        int tour_id FK
        float total_price
        string status
        datetime created_at
    }
    Payment {
        int id PK
        int tour_id FK
        float amount
        string status
        string reference_number
    }
    
    Client ||--o{ Tour : books
    Tour ||--o{ Quotation : has
    Tour ||--o{ Payment : receives
```

## Migration Scheme
All database mutations are handled sequentially through Alembic.
* Generate schema migrations:
  `alembic revision --autogenerate -m "Add new schema"`
* Run database updates:
  `alembic upgrade head`
