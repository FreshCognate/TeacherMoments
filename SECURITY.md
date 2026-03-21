# Security Meeting Agenda

## 1. Solution Overview

### Business Purpose

TeacherMoments is an educational platform for creating, managing, and running interactive teaching scenarios. Educators build scenario-based learning experiences that students engage with, featuring real-time feedback and response tracking.

### High-Level Architecture

The application is a three-service architecture:

| Service | Technology | Purpose |
|---------|-----------|---------|
| Frontend | React 18 with SSR (React Router 7, Vite) | User-facing web application |
| Backend | Express.js API server with Socket.io | REST API, authentication, real-time WebSocket communication |
| Workers | Node.js with BullMQ | Background job processing (audio transcription, AI feedback, exports) |

Supporting infrastructure:

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Database | MongoDB (Mongoose ODM) | Primary data store |
| Cache/Queue | Redis | Job queue (BullMQ) and Socket.io pub/sub adapter |
| Object Storage | S3-compatible (DigitalOcean Spaces) | Media file storage (audio, images) |
| Email | Postmark | Transactional emails (OTP delivery) |
| AI | Google Gemini | Audio transcription, feedback generation |
| Bot Protection | Cloudflare Turnstile | CAPTCHA on login and signup |

---

## 2. Authentication

### Authentication Method

Email-based One-Time Password (OTP). No passwords are stored in the system.

- A 6-digit cryptographically random code is generated using `crypto.randomInt()`
- Codes expire after 10 minutes
- Delivered to the user's email address via Postmark

### Rate Limiting & Account Lockout

- Max 5 OTP requests per 15-minute window
- Max 5 verification attempts per OTP
- 30-second cooldown between OTP requests
- Automatic 15-minute account lockout after exceeding thresholds

### Session Management

- Server-side sessions stored in MongoDB (connect-mongo)
- 30-day session TTL
- Session cookies secured with `httpOnly`, `secure` (production), and `sameSite: lax` flags

### Bot Protection

Cloudflare Turnstile CAPTCHA is enabled on login and signup endpoints with server-side verification.

### Role-Based Access Control

Five roles with increasing privilege levels:

1. PARTICIPANT
2. RESEARCHER
3. FACILITATOR
4. ADMIN
5. SUPER_ADMIN

Protected routes use `isAuthenticated()` and `hasPermissions()` middleware.

### HTTP Security Headers

Helmet.js middleware is applied to all responses, providing:

- Strict-Transport-Security (HSTS)
- Content-Security-Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- X-DNS-Prefetch-Control
- X-Permitted-Cross-Domain-Policies

### SSO / MFA / SAML 2.0 / OpenID Connect / Clever

| Method | Status |
|--------|--------|
| SSO | Not implemented |
| MFA | Not implemented (OTP via email provides single-factor authentication) |
| SAML 2.0 | Not supported |
| OpenID Connect | Not supported |
| Clever | Not supported |

---

## 3. Data

### Classification

**Low / Public** — The application stores basic contact information and educational scenario responses. No FERPA or COPPA-regulated data is collected.

### Data Stored

| Category | Fields |
|----------|--------|
| PII | Email address, first name, last name, username |
| Educational | Scenario responses (text, selected options), audio recordings, AI-generated transcripts, scenario completion tracking |
| Metadata | Timestamps (created, updated, deleted), user roles, consent records |

### Storage Location

All infrastructure is hosted on DigitalOcean managed services in the Frankfurt (EU) region. Data is not stored in the U.S. — this has been confirmed as acceptable.

### Encryption In Transit

TLS is enforced on all connections:

| Connection | Method |
|-----------|--------|
| MongoDB | `tls=true` parameter in connection string |
| Redis | `rediss://` protocol (TLS-secured) |
| Object Storage (S3) | HTTPS endpoint |
| Application | HTTPS enforced in production |
| WebSocket (Socket.io) | Secured via HTTPS transport |

### Encryption At Rest

Infrastructure-level encryption is provided by DigitalOcean for all managed services:

- **MongoDB**: DigitalOcean Managed Databases encrypt data at rest
- **Redis**: DigitalOcean Managed Databases encrypt data at rest
- **Spaces (S3)**: DigitalOcean Spaces encrypts stored objects at rest

No additional application-level encryption at rest is applied.

### Data Retention

Soft deletes with audit trail — records include `deletedAt` and `deletedBy` fields rather than being permanently removed.

---

## 4. Security

### Application Vulnerability Scanning

Not yet performed. To be scheduled as part of this security review process.

### Penetration Testing

Not yet performed. To be scheduled as part of this security review process.

### Current Security Controls

| Control | Implementation |
|---------|---------------|
| Input Validation | Joi schema validation on all API routes (body, query, files) |
| Rate Limiting | express-rate-limit on all endpoints with configurable windows |
| CORS | Configured per-route |
| Bot Protection | Cloudflare Turnstile CAPTCHA on authentication endpoints |
| Security Headers | Helmet.js middleware on all responses |
| Session Security | httpOnly, secure, and sameSite cookie flags |
| Account Lockout | Automatic lockout after failed authentication attempts |
| Audit Trail | Soft deletes with deletedAt/deletedBy tracking |
| Request Size Limits | 50MB limit on request bodies |

### IoT & Other Testing

Not applicable. TeacherMoments is a web-only application with no IoT components. See Scoping & Authorization documentation for testing scope details.

---

## 5. Cloud Services Agreement

### Parties

- **Vendor**: TeacherMoments ("Provider")
- **Agency**: U.S. University ("Institution")

**Effective Date**: _______________
**Term**: 1 year from the Effective Date, with automatic renewal unless terminated with 90 days' written notice.

---

### 5.1 Scope of Services

The Provider shall deliver the TeacherMoments platform as a cloud-hosted software service, including:

- Web-based scenario authoring and management tools
- Student-facing scenario participation interface
- Real-time collaboration and feedback via WebSocket connections
- Background processing services (audio transcription, AI-generated feedback, data exports)
- Object storage for uploaded media (audio recordings, images)

### 5.2 Data Ownership and Handling

1. **Ownership**: All data entered into the platform by the Institution, its faculty, and its students ("Institution Data") remains the sole property of the Institution.
2. **Limited Use**: The Provider shall not access, use, sell, or disclose Institution Data except as necessary to deliver the services described herein or as required by law.
3. **Data Classification**: Institution Data is classified as **Low / Public**. No FERPA-protected education records or COPPA-regulated data is collected or stored.
4. **Data Collected**: The platform collects email addresses, first and last names, usernames, scenario responses (text and selected options), audio recordings, AI-generated transcripts, and associated metadata (timestamps, roles, consent records).
5. **Sub-processors**: The Provider uses the following third-party sub-processors to deliver the service:

| Sub-processor | Purpose | Data Accessed |
|---------------|---------|---------------|
| DigitalOcean | Infrastructure hosting (compute, database, storage) | All Institution Data |
| Google (Gemini) | Audio transcription, AI feedback generation | Audio recordings, text responses |
| Postmark | Transactional email delivery | Email addresses |
| Cloudflare | Bot protection (Turnstile CAPTCHA) | IP addresses (no Institution Data) |

### 5.3 Data Location and Storage

1. All primary infrastructure is hosted on **DigitalOcean managed services in the Frankfurt (FRA1) region** (European Union).
2. Data may transiently pass through third-party sub-processor infrastructure (e.g., Google Gemini API endpoints) for processing purposes only and is not persisted by those sub-processors beyond the scope of the request.

### 5.4 Encryption and Security

1. **In Transit**: All data is encrypted in transit using TLS across all connections (database, cache, object storage, application, and WebSocket).
2. **At Rest**: All data is encrypted at rest via DigitalOcean's infrastructure-level encryption for managed databases (MongoDB, Redis) and object storage (Spaces).
3. **Authentication**: Email-based One-Time Password (OTP) with rate limiting, account lockout, and Cloudflare Turnstile bot protection.
4. **Application Security**: Input validation (Joi), rate limiting, CORS, security headers (Helmet.js), httpOnly/secure/sameSite session cookies, and soft deletes with audit trail.

### 5.5 Service Level Commitments

1. **Availability Target**: The Provider shall use commercially reasonable efforts to maintain **99.5% uptime** during each calendar month, excluding scheduled maintenance windows.
2. **Scheduled Maintenance**: The Provider shall give at least **48 hours' written notice** before planned maintenance that may affect service availability.
3. **Support**: The Provider shall respond to critical service disruptions within **4 business hours** and non-critical issues within **2 business days**.

### 5.6 Incident Response and Notification

1. **Detection and Response**: The Provider shall maintain reasonable monitoring and incident response procedures for detecting unauthorized access to or disclosure of Institution Data.
2. **Notification Timeline**: In the event of a confirmed security incident involving Institution Data, the Provider shall notify the Institution within **72 hours** of becoming aware of the incident.
3. **Notification Content**: Incident notifications shall include:
   - Description of the incident and data affected
   - Date and time of discovery
   - Actions taken or planned to contain and remediate the incident
   - Point of contact for further information
4. **Cooperation**: The Provider shall cooperate with the Institution's investigation and response efforts and provide reasonable assistance.

### 5.7 Data Portability and Deletion

1. **Export**: Upon written request, the Provider shall make Institution Data available for export in a standard machine-readable format (JSON or CSV) within **30 days**.
2. **Termination Retrieval Period**: Upon termination or expiration of this Agreement, the Institution shall have **90 days** to request export of its data.
3. **Deletion**: Following the retrieval period (or upon earlier written request), the Provider shall delete all Institution Data from production systems within **30 days** and from backup systems within **90 days**.
4. **Certification**: The Provider shall provide written confirmation of data deletion upon request.

### 5.8 Compliance

1. The Provider represents that its services and data handling practices comply with applicable federal and state data protection laws.
2. The Provider shall not store or process data classified as protected under FERPA, COPPA, or HIPAA unless a separate data processing agreement is executed.
3. The Provider shall notify the Institution within **30 days** of any material changes to its sub-processors, data storage locations, or security practices.

### 5.9 Limitation of Liability

The Provider's total liability under this Agreement shall not exceed the total fees paid by the Institution in the **12 months** preceding the claim. Neither party shall be liable for indirect, incidental, or consequential damages.

### 5.10 Termination

1. Either party may terminate this Agreement for convenience with **90 days' written notice**.
2. Either party may terminate for cause if the other party materially breaches this Agreement and fails to cure within **30 days** of written notice.
3. Sections 5.2 (Data Ownership), 5.6 (Incident Response), 5.7 (Data Portability and Deletion), and 5.9 (Limitation of Liability) shall survive termination.

### 5.11 Signatures

| | Provider | Institution |
|---|---|---|
| **Name** | _______________ | _______________ |
| **Title** | _______________ | _______________ |
| **Signature** | _______________ | _______________ |
| **Date** | _______________ | _______________ |
