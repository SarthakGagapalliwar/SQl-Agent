# SQL-Agent — Project Report

## Page 1 — Introduction

Title: SQL-Agent — AI-powered PostgreSQL Query Assistant (Project Report)

Introduction
The SQL-Agent project is an intelligent PostgreSQL query assistant that converts natural language questions into safe, schema-aware SQL queries and executes them against a PostgreSQL database. The repository uses Next.js for the frontend and Drizzle for database access. The system integrates AI (Mistral/Codestral via the Vercel AI SDK), streaming responses, and real-time query execution while ensuring secure, repeatable deployments through DevOps automation with Terraform, Puppet, and Ansible.

Purpose and scope

- Provide developers and analysts an intuitive, secure interface to ask natural language queries and get real SQL results instantly.
- Ensure schema-awareness and safety checks so only read-only queries (SELECT) execute; no destructive queries are allowed.
- Automate provisioning and configuration of cloud resources, CI/CD pipelines, and deployment orchestration to accelerate delivery and maintain runtime consistency.

Why DevOps matters for SQL-Agent
Automated infrastructure and configuration reduce drift, speed up reproducible test environments, and secure secret handling for AI keys and DB credentials. Using Terraform, Puppet, and Ansible together ensures the database, application runtime, and deployment process are auditable and recoverable.

Repo mapping and assumptions

- Frontend: Next.js (files in `src/app`, UI in `page.tsx`), TypeScript, Tailwind CSS.
- Database: PostgreSQL (Neon recommended) accessed via Drizzle (see `drizzle.config.ts` and `src/app/db`).
- AI: Mistral / Vercel AI SDK for query generation and streaming.

## Page 2 — Objectives and Functional Goals

Project objectives

- Convert plain English to safe, optimized PostgreSQL queries with schema awareness.
- Execute queries in real time and stream results back to the UI while providing tooling visibility (schema load, execution plan, row count).
- Build robust DevOps automation: Terraform for resource provisioning, Puppet for node baseline configuration, and Ansible for deployments and operational playbooks.

Functional requirements

- Natural language input and streaming AI responses.
- Schema loader that inspects DB metadata and feeds it to the model before generation.
- Query safety layer: validate generated SQL to enforce read-only operations and limit resource-heavy queries.
- Query execution and results display with pagination and result export.

Non-functional requirements

- Security: API keys (MISTRAL_API_KEY) and DB credentials stored securely in secret manager; TLS enforced.
- Performance: time-limited queries, result-size caps, and rate limiting to protect the DB.
- Observability: metrics for query latency, model latency, AI errors, and DB load.
- Reproducibility: environment provisioning via Terraform and immutable container images for CI.

Success criteria

- Fully automated environment provisioning (dev/stage/prod) via Terraform with remote state.
- Puppet-managed nodes ensure consistent runtime (Docker, runtime libraries, monitoring agents).
- Ansible playbooks support repeatable deployments, automated schema migrations, and fast rollback.

## Page 3 — Tools & Technologies (project-specific)

Application stack (as in `README.md`)

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS.
- AI/ML: Mistral AI (Codestral) and Vercel AI SDK for streaming and model calls.
- Database: PostgreSQL (Neon recommended) with Drizzle ORM for type-safe queries and migrations.
- Deployment: Vercel (for preview and hosting) or self-hosted containers on AWS/EKS for production.

DevOps & infra choices

- Terraform: provision VPC (if self-hosted), compute (EKS/ECS or EC2 ASG), managed Postgres (if not using Neon), S3 buckets for artifacts, and IAM policies.
- Puppet: ensure node consistency (Docker, Node runtime, monitoring agents) and apply security baselines.
- Ansible: orchestrate container deployments, run Drizzle migrations (`pnpm run db:migrate`), rotate secrets, and implement rollback playbooks.
- CI/CD: GitHub Actions or similar — build, test, scan, push image, and trigger Ansible deployments.
- Secrets: AWS Secrets Manager, Azure Key Vault, or HashiCorp Vault to store MISTRAL_API_KEY and DATABASE_URL.

Why this setup fits SQL-Agent
The app needs fast iteration for AI model integration (CI builds) and strict guardrails for DB access (safety checks). Terraform, Puppet, and Ansible together provide stable infra, consistent nodes, and repeatable deployments.

## Page 4 — DevOps Integration (applied to SQL-Agent)

Detailed deployment flow tailored for SQL-Agent

1. Infrastructure provisioning with Terraform

   - If self-hosted: create VPC, subnets, EKS cluster or EC2 autoscaling groups, and provision a managed Postgres instance or simple RDS/Neon connection configuration.
   - Create IAM roles and policies for CI service accounts (least privilege) and for the application to read secrets.
   - Provision S3 (or cloud storage) for artifact storage and remote Terraform state with locking.

2. Baseline configuration with Puppet

   - Puppet manifests install and lock required packages (Docker, node, systemd services) and apply OS hardening rules.
   - Install and configure monitoring/logging agents (Prometheus node exporter, filebeat) and ensure correct system user permissions for container runtime.

3. Application deployment and orchestration with Ansible
   - CI builds container images (optional for Vercel deployments) and pushes tagged images to a registry.
   - Ansible playbooks deploy images to the target cluster/VMs, render config templates for `.env` (pulling secrets from the secret manager), run Drizzle migrations, and perform canary/rolling updates.
   - Playbooks include pre-checks (DB connectivity, schema compatibility) and post-deploy smoke tests (load sample queries, check streaming responses).
   - Rollback playbooks revert service to previous image tag and run health checks.

CI/CD and safety gates

- CI runs unit and integration tests, plus static analysis for SQL generation safety rules.
- A gating step verifies the AI-generated SQL passes a safety filter (ensures only SELECT, timeouts, row limits) before allowing execution on any shared/staging DB.

Security and secrets handling

- Store `MISTRAL_API_KEY` and `DATABASE_URL` in Vault or provider secret manager; Ansible retrieves them at deployment time without persisting secrets in source control.
- Use Terraform to provision IAM roles with minimum privileges needed by the app and CI.
- Enforce network-level protections (private subnets for databases, limited egress for model API calls if required).

Observability and operational playbooks

- Instrument query latency, model call duration, and DB CPU/connection metrics. Configure alerts for abnormal AI response times or DB errors.
- Ansible playbooks for backups, DB restores, and secret rotation automate operational duties.

## Page 5 — Implementation Notes, Testing, Conclusion & Future Work

Architecture summary (SQL-Agent specifics)

- UI: Next.js pages + streaming UI call the `/api/chat` endpoint for model orchestration.
- API: Next.js API routes handle prompt building, schema loading (via Drizzle), SQL safety checks, and execution against PostgreSQL.
- DB: PostgreSQL (Neon or managed) with read-only credentials used for AI-executed queries; sensitive maintenance credentials stored separately.
- Deployment choices: Vercel for frontend previews; production on EKS/ECS with images built during CI and deployments managed by Ansible.

Testing & validation

- Local: developer runs with `pnpm dev` and local Postgres; Drizzle seeds (`pnpm dlx tsx src/app/db/db.seed.ts`) provide sample schema/data.
- CI: unit tests for parsing, integration tests around schema load and SQL safety checks, and E2E smoke tests that verify sample queries run and stream correctly.
- Pre-deploy safety: run generated SQL through a sandbox checker (limit allowed statements, enforce row limits and timeouts) in CI before enabling execution on staging/prod.

Operational runbooks & monitoring

- Provide runbooks for rotating `MISTRAL_API_KEY`, restoring DB from backups (Terraform-managed snapshots), and performing emergency rollback using Ansible.
- Dashboards: model latency, query latency, failed-safe triggers, and DB connection saturation.

Benefits realized

- Fast, safe access to analytics and insights without requiring SQL knowledge.
- Repeatable deployments and secure secret handling reduce risk of leaks or downtime.
- Puppet reduces configuration drift across hosts; Terraform ensures environment parity; Ansible automates deploys and recoveries.

Future enhancements

- Introduce a query sandbox with simulated cost estimation before execution for heavy queries.
- Add role-based query permissions and stricter row-level security policies for multi-tenant DBs.
- Move to GitOps for deployment (ArgoCD/Flux) to increase auditability and reduce imperative deploy steps.
- Expand AI safety: adversarial prompt detection and further SQL normalization/optimization.

Conclusion
This revised report aligns with the `sql-agent` project: an AI-powered, schema-aware PostgreSQL query assistant built with Next.js and Drizzle. It explains how Terraform, Puppet, and Ansible can be applied to provision infrastructure, enforce consistent node configuration, and orchestrate safe, repeatable deployments. These DevOps practices make SQL-Agent safer, more reliable, and easier to operate in production.

