# OTEI_BACKEND_GUIDE.md

This guide explains how to build a secure, maintainable, and production-ready Django backend (API) for the Ogbomoso Tech & Entrepreneurship Ignite (OTEI) frontend. It covers project setup, recommended packages, API design (endpoints), security hardening, deployment options, observability, backups, and operational recommendations. I wrote this as an end-to-end playbook so you — or any engineer on your team — can implement the backend reliably.

Table of contents
1. Objectives & constraints
2. Tech stack and versions
3. Project layout & repository structure
4. Local development — quickstart
5. Dependencies & recommended packages
6. Settings (environment variables and secure defaults)
7. Data model suggestions (mappings to frontend forms)
8. API endpoints (design + examples)
9. Validation, anti-spam, and data integrity
10. Authentication & authorization
11. File uploads & storage
12. Email and transactional flows
13. Testing, CI, and release workflow
14. Production deployment options and steps
15. Monitoring, logging, and error-reporting
16. Database, backups, migrations and DR
17. Security hardening checklist
18. Privacy & compliance
19. Performance & scalability
20. Example dev checklist and next steps

---

1. Objectives & constraints
- Build a RESTful API that accepts registrations and partner (sponsor/exhibitor) applications from the existing frontend.
- Strong server-side validation and anti-abuse protections.
- Secure handling of PII (names, emails, phone numbers).
- Provide admin endpoints for the events team to list/modify data.
- Reasonable cost and operational complexity for initial launch (can be scaled later).

---

2. Tech stack and versions (recommended)
- Python 3.11+ (or latest 3.10/3.11 stable).
- Django LTS (>= 4.x) and Django REST Framework (DRF).
- PostgreSQL (managed DB like AWS RDS or DigitalOcean Managed DB).
- Gunicorn + Nginx for traditional host-based deployment OR Docker + an orchestrator (ECS/Fargate, Render, Heroku, etc).
- Redis for caching and Celery broker (optional but recommended if you use background tasks).
- Optional: Sentry for error monitoring.

---

3. Project layout & repository structure (recommended)
- Root repository
  - `backend/` (Django project root)
    - `otei_backend/` (Django project package)
      - `settings/`
        - `base.py`
        - `local.py`
        - `production.py`
      - `urls.py`
      - `wsgi.py`
      - `asgi.py` (if using async features)
    - `events/` (app for registrations, sponsors, exhibitors, volunteers)
      - `models.py`
      - `serializers.py`
      - `views.py`
      - `urls.py`
      - `admin.py`
      - `tasks.py` (Celery tasks)
      - `tests/`
    - `users/` (optional - for custom admin or auth users)
    - `requirements.txt`
    - `Dockerfile`
    - `docker-compose.yml`
    - `manage.py`
    - `Procfile` (for Heroku)
  - `infra/` (deployment manifests, Terraform, Kubernetes, systemd files)
  - `docs/` (API docs, runbooks)
  - `.env.example`

Notes:
- I recommend splitting settings into `base`, `local`, and `production` and using `django-environ` or `python-dotenv` for environment variables.

---

4. Local development — quickstart (high level)
1. Create a virtual environment:
   - `python -m venv .venv`
   - `source .venv/bin/activate`
2. Install dependencies:
   - `pip install -r requirements.txt`
3. Create `.env` from `.env.example` and fill with dev values.
4. Setup local DB (Postgres). Export connection string in `DATABASE_URL`.
5. Run migrations and create superuser:
   - `python manage.py migrate`
   - `python manage.py createsuperuser`
6. Run development server:
   - `python manage.py runserver`

(These commands are examples you will add to your README. Keep secrets out of source control.)

---

5. Dependencies & recommended packages
- Core:
  - `Django`
  - `djangorestframework`
- Environment & configuration:
  - `django-environ` or `python-dotenv`
- Database and storage:
  - `psycopg2-binary` (Postgres driver)
  - `django-storages` + `boto3` (if using S3)
- Security / auth:
  - `djangorestframework-simplejwt` (JWT auth)
  - `django-axes` or `django-ratelimit` for brute force protection (optional)
- CORS:
  - `django-cors-headers`
- Background tasks (optional but recommended):
  - `celery[redis]` or `celery[rabbitmq]` (choose a broker)
- Monitoring & docs:
  - `sentry-sdk` (for Sentry)
  - `drf-spectacular` or `drf-yasg` for OpenAPI / swagger
- Dev tooling:
  - `pytest`, `pytest-django`, `factory_boy` (tests)
  - `black`, `flake8` (formatting & linting)

---

6. Settings (environment variables and secure defaults)

Essential environment variables:
- `SECRET_KEY` — never commit; read from environment.
- `DEBUG` — boolean. Set to `False` in production.
- `DATABASE_URL` — Postgres connection string (use `DJANGO_DB` or `DATABASE_URL`).
- `ALLOWED_HOSTS` — production hostnames.
- `CORS_ALLOWED_ORIGINS` — list of frontend origins.
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `DEFAULT_FROM_EMAIL`.
- `DJANGO_LOG_LEVEL` — e.g., `INFO`.
- `SENTRY_DSN` — optional for error monitoring.
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_STORAGE_BUCKET_NAME` — if using S3.

Security-related settings (enforce in `production.py`):
- `DEBUG = False`
- `ALLOWED_HOSTS = [...]`
- `SECURE_SSL_REDIRECT = True`
- `SESSION_COOKIE_SECURE = True`
- `CSRF_COOKIE_SECURE = True`
- `SECURE_HSTS_SECONDS = 60` (then increase to 6 months after validation)
- `SECURE_HSTS_INCLUDE_SUBDOMAINS = True`
- `SECURE_CONTENT_TYPE_NOSNIFF = True`
- `X_FRAME_OPTIONS = "DENY"` (or SAMEORIGIN if you need it)
- `SECURE_BROWSER_XSS_FILTER = True`
- Use `Content-Security-Policy` headers via middleware or webserver to limit allowed sources.

CORS & CSRF:
- Use `django-cors-headers`. Configure `CORS_ALLOWED_ORIGINS` with frontend origin(s) (e.g., `https://otei.example.com`).
- If frontend and backend are same origin you can use session-based auth and CSRF cookies; if using token-based auth, follow the chosen pattern's recommendations (SimpleJWT + token in Authorization header).

Secrets:
- Store secrets in environment variables or secrets manager (AWS Secrets Manager, Vault).
- Set up key rotation and limited access.

---

7. Data model suggestions (core models)
Below are the recommended models and main fields. Adjust types and constraints to your needs.

- `Registration` (for attendees)
  - `first_name`, `last_name`
  - `email` (unique per event maybe)
  - `phone`
  - `gender` (choice field)
  - `city`
  - `organization_name` (nullable)
  - `role` (nullable)
  - `years_experience` (optional)
  - `participant_categories` (ManyToMany or JSON list — e.g., Student, Startup Founder)
  - `interest_areas` (JSON or ManyToMany)
  - `full_attendance` (boolean or choice)
  - `hear_about` (string)
  - `special_requests` (text)
  - `accessibility_needs` (nullable text)
  - `pitch_startup` (boolean)
  - `post_event_mentorship` (boolean)
  - `join_community` (boolean)
  - `agree_updates` (boolean)
  - `physical_event_ack` (boolean)
  - `created_at`, `updated_at`

- `SponsorApplication`
  - `org_name`, `org_type`
  - `website`
  - `office_address`
  - `contact_person_name`, `job_title`, `contact_email`, `contact_phone`
  - `sponsor_tier` (choice)
  - `sponsor_budget` (optional)
  - `interests` (JSON)
  - `outcomes` (text)
  - `confirmed` (boolean)
  - `created_at`, `updated_at`

- `ExhibitorApplication`
  - `business_name`, `industry_category`, `business_description`
  - `contact_person_name`, `contact_email`, `contact_phone`
  - `exhibition_package` (choice)
  - `power_internet_required` (boolean)
  - `compliance_declaration` (boolean)
  - `terms_agreement` (boolean)
  - `created_at`, `updated_at`

- `VolunteerApplication` (if not reused)
  - `full_name`, `age_range`, `email`, `phone`, `location`
  - `volunteer_area`, `skills` (text)
  - `available_on_event_date` (choice)
  - `briefing_available` (choice)
  - `motivation` (text)
  - `terms` (bool)
  - `created_at`

- Additional:
  - `Event` model (if you plan multiple events)
  - `AdminUser` or reuse Django's `User` for internal admin.

Design tips:
- Add unique constraints (e.g., email + event) if required.
- Index frequently queried fields (like `email`, `created_at`).
- Use `JSONField` for flexible multi-select fields to avoid extra join tables for a simple MVP.

---

8. API endpoints (design + examples)

I recommend DRF with ViewSets or APIViews. Design the API to be RESTful and consistent. All POST endpoints should return appropriate HTTP status codes and standardized JSON payloads.

Suggested endpoints
- `POST /api/register/`
  - Purpose: attendee registration
  - Request: JSON or form-data matching `Registration` fields
  - Response: `201 Created` with `{"id": <int>, "message": "Registration received", "data": {...}}`
- `POST /api/sponsors/`
  - Purpose: submit sponsor application
  - Response: `201 Created`
- `POST /api/exhibitors/`
  - Purpose: submit exhibitor application
- `POST /api/volunteer/`
  - Purpose: volunteer application
- `GET /api/admin/registrations/` (admin only)
  - Purpose: list registrations (paginated)
- `GET /api/admin/sponsors/` (admin only)
- `GET /api/admin/exhibitors/` (admin only)

Authentication:
- Public endpoints (forms) generally do not require auth but must be protected by rate-limiting, reCAPTCHA and/or email verification.
- Admin endpoints require strong auth (session + staff flag or token-based with admin privileges).

Error responses:
- Return consistent error format, e.g., `{"errors": [{"field": "email", "message": "This email is already registered"}]}`

Rate limiting:
- Apply DRF throttling classes or `django-ratelimit` to form endpoints with a reasonable threshold (e.g., 10 requests/IP/hour for unauthenticated form posts). Consider more strict rules for repeated fails.

OpenAPI docs:
- Add `drf-spectacular` and expose Swagger/OpenAPI UI at `/api/schema/` and `/api/docs/` (protected or public as you choose).

---

9. Validation, anti-spam, and data integrity

Server-side validation:
- Re-validate all constraints on server:
  - Field lengths
  - Email format & domain (if you need)
  - Phone normalization and pattern matching (international E.164 is recommended)
- Normalize phone numbers (use `phonenumbers` library).

Anti-spam protections:
- Use reCAPTCHA (v2/3) or hCaptcha on frontend; verify token on backend before accepting the submission.
- Rate limiting (throttling) on API endpoints.
- Integrate basic heuristics: reject submissions with too many links, suspicious payload size, or identical content in quick succession.
- Consider email confirmation (send a verification email with a link to confirm registration).

Logging & alerts:
- Log suspicious patterns: repeated IPs, malformed requests, or high submission rates.

---

10. Authentication & authorization

Admin access:
- Use Django admin for event staff. Restrict admin logins by IP (if possible) or add 2FA (`django-otp`, `django-two-factor-auth`).
- Use least-privilege: admins/staff should only have permissions they need.

API token strategy:
- For internal API or programmatic access, use JWT (`djangorestframework-simplejwt`) with:
  - Short-lived access tokens (minutes)
  - Refresh tokens with rotation and blacklisting (optional)
- For the public form submission flow, prefer CSRF-protected session auth if forms are submitted from same origin, or standard Authorization header bearer tokens if the frontend is on a separate origin.

Admin endpoint protection:
- Decorate admin endpoints with `IsAdminUser` (DRF) or custom permission classes.

---

11. File uploads & storage
- If you need to accept file attachments (e.g., sponsor PDFs), prefer S3 (or equivalent) and configure `django-storages`. Ensure:
  - Max file size limits (e.g., 10MB).
  - Accept only allowed mime types.
  - Virus scanning pipeline (ClamAV or third-party).
  - Temporary storage for processing and then move to immutable storage.

For static assets:
- Use S3 + CloudFront (recommended) or serve static assets via CDN.
- Use `collectstatic` in CI to upload to S3 if using cloud storage.

---

12. Email and transactional flows
- Use a reliable SMTP provider like SendGrid, Mailgun, Postmark, or AWS SES.
- Use transactional email for:
  - Registration confirmations
  - Sponsor/exhibitor receipts
  - Admin alerts on new submissions
- Template emails and localizations: store email templates in Django templates and render server-side.
- Rate-limit email sends; queue with Celery to avoid blocking the request.

Example flow:
1. Form submission POST -> backend validates.
2. Record saved to DB -> create email job (Celery) to send confirmation and notify staff.
3. Return success response to the frontend.

---

13. Testing, CI, and release workflow
Test strategy:
- Unit tests for serializers and model validation.
- Integration tests for API endpoints (use `pytest-django`).
- End-to-end tests for main flows (optional).

CI pipeline (example GitHub Actions):
- Run linters and formatters (`black`, `flake8`)
- Run tests
- Run security checks (`pip-audit` or `safety`)
- Build Docker image (if using)
- On merge to `main`:
  - Run database migrations
  - Deploy or push new image to registry
  - Run smoke tests against staging

Migrations:
- Prefer atomic migrations and run them in a controlled manner during deploy. Test migrations in staging.

---

14. Production deployment options and steps (recommended)
Options (in increasing operational complexity):
- Heroku / Render: easiest to get started; good defaults for small teams.
- Docker on VPS + systemd (DigitalOcean droplets) with Nginx + Gunicorn.
- AWS ECS/Fargate or EKS (or similar managed container platforms) — more scalable.
- Elastic Beanstalk — managed, but less control.

Typical production stack (Gunicorn + Nginx):
1. Build and test the code in CI.
2. Build a Docker image (or package code on server).
3. Migrate database: `python manage.py migrate --noinput`.
4. Collect static files: `python manage.py collectstatic --noinput`. (Prefer to serve via S3+CDN.)
5. Run Gunicorn:
   - `gunicorn otei_backend.wsgi:application --bind 127.0.0.1:8000 --workers 3 --threads 2`
6. Nginx as reverse proxy, handle TLS (Let's Encrypt).
7. Configure systemd to manage Gunicorn process.
8. Setup monitoring and log rotation.

Docker notes:
- Use a small base image (`python:3.11-slim`) and multi-stage builds.
- Keep secrets out of Dockerfile (use env vars or secret manager).

DNS & TLS:
- Use managed TLS (CloudFront + ACM, or Certbot on server).
- Redirect HTTP -> HTTPS.

CI/CD:
- On push to `main` run CI pipeline then deploy (e.g., push image, update service, or use a platform API).

---

15. Monitoring, logging, and error-reporting
- Error reporting: `sentry-sdk` to capture exceptions and transaction context.
- Structured logs: JSON logs from Django or Gunicorn and forward to ELK/Datadog.
- Performance monitoring: optional APM (Datadog, NewRelic).
- Uptime: Pingdom or similar.
- Alerting: set alerts for error rate increase, host down, queue length spike (Celery), or DB connection errors.

---

16. Database, backups, migrations and Disaster Recovery
- Database: PostgreSQL (use managed service).
- Backups:
  - If managed DB, enable automated daily snapshots and point-in-time recovery.
  - Daily `pg_dump` or incremental backups if self-hosted.
- Verify backups regularly by restoring to a staging instance.
- Migrations:
  - Use safe migration practices (avoid destructive operations in single-step migrations on busy tables).
- DR plan:
  - Document RTO and RPO goals.
  - Automate infrastructure provisioning with Terraform.

---

17. Security hardening checklist (summary)
- Use `DEBUG = False`.
- Ensure `SECRET_KEY` is secret and rotated.
- Use TLS for all inbound traffic.
- Set cookie security flags: `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, `SESSION_COOKIE_HTTPONLY`, `CSRF_COOKIE_HTTPONLY` (if applicable).
- HSTS enabled (`SECURE_HSTS_SECONDS`).
- CSP headers applied.
- Limit `ALLOWED_HOSTS`.
- Use strong password validators.
- Restrict admin access and enable 2FA.
- Use an intrusion detection or blocking tool (e.g., `django-axes`).
- Sanitize and validate all inputs on server.
- Throttle public endpoints.
- Don't store secrets in source control.
- Keep dependencies updated. Run `pip-audit` or equivalent in CI.
- Regular pentests before production launch.

---

18. Privacy & compliance
- Have a `privacy policy` page describing PII collection, retention, and sharing.
- Store minimal PII and limit retention to what you need.
- Provide an endpoint/process to delete user data on request (subject access request).
- Use HTTPS and encrypt sensitive fields in DB if required.
- If transferring personal data across borders, ensure legal compliance (GDPR-like considerations).

---

19. Performance & scalability
- Cache expensive queries with Redis.
- Use Redis for session store if scaling across multiple app servers.
- Use background tasks (Celery) for anything blocking: sending emails, generating reports, large exports.
- Add DB indexes for fields used in filters.
- Consider read-replicas for high-read workloads (if necessary).
- Use a CDN for static assets.

---

20. Example dev checklist & next steps (practical)
1. Create repository and scaffold Django project: `django-admin startproject ...`, create `events` app.
2. Add required packages to `requirements.txt`.
3. Implement models for `Registration`, `SponsorApplication`, `ExhibitorApplication`, `VolunteerApplication`.
4. Implement DRF serializers with server-side validation.
5. Implement API views (function-based or class-based) for the endpoints listed above. Add throttling and reCAPTCHA verification on form endpoints.
6. Add admin registration for models (so staff can browse entries).
7. Add email sending via Celery worker.
8. Add OpenAPI documentation with `drf-spectacular`.
9. Write unit tests for serializers and integration tests for endpoints.
10. Prepare a `Dockerfile` and `docker-compose.yml` for local dev (Postgres, Redis, Celery).
11. Create `.env.example`, document environment variables.
12. Integrate Sentry and test error reporting.
13. Setup staging environment and perform smoke tests with the frontend.
14. Deploy to production with secure TLS configuration, ensure backups are working, and monitor logs and errors.

---

Appendix: Example JSON response shape (use this consistently)
- Success:
  - `{"status": "success", "message": "Registration received", "data": {"id": 123}}`
- Validation error:
  - `{"status": "error", "errors": [{"field": "email", "message": "Invalid email format"}]}`
- Server error:
  - `{"status": "error", "message": "An internal error occurred"}`

---

Closing notes
- I aimed for a practical, security-first backend plan that fits the current frontend. The roadmap above will get you from zero to a secure production-grade API that handles registrations, sponsor/exhibitor submissions, and volunteer onboarding.
- If you'd like, I can:
  - Provide concrete Django model code, serializer examples, and DRF views for the `Registration` and `SponsorApplication` models.
  - Draft a `Dockerfile` and `docker-compose.yml`.
  - Scaffold the initial Django project file structure and a minimal settings template.
  - Create a Postman collection or OpenAPI schema that the frontend team can use.

Tell me which deliverable you want first (models/serializers, Docker + CI, or a production deployment recipe for a specific host like Render/DigitalOcean/AWS) and I’ll produce it next.