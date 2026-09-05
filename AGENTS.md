# Custom Project Rules & Guidelines

## Database Migrations Protocol
- **MANDATORY SQL SCRIPT GENERATION**: Whenever any code modification involves database tables, new columns, index additions, enum status values, or Row Level Security (RLS) policies:
  1. Always update the local master SQL file (`/database-migrations.sql`).
  2. Always explicitly provide the exact, copy-paste ready, idempotent SQL script in the response so the user can execute it immediately in the database SQL editor.
  3. Include `IF NOT EXISTS` and `DROP POLICY IF EXISTS` clauses for safe execution.
