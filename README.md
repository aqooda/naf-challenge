## NAF Challenge
A demo of request approval system with pdf document

### Prerequisites
- Node.js v14.x LTS
- Docker

### Live Demo
https://naf-challenge.aqooda.com/requests

### Assumptions and Explainations
- Requester and approver should have their own account, requester should select the approver email instead of free input.
- All highlights are not required to be approved, partially approval is allowed.
- Access token should be used in API requests, no strict authorization checking in demo.
- The system should be used in desktop only, mobile devices are not good fit to highlight things on PDF.
- Minimum screen width is configured for better user experience.

### Idea for supporting multi-levels approval
- Approver can request another person to review the request just like requester.
- Highlights will be duplicated in database for new approver, and a new column `approverEmail` will be added to identify approver.
- `approverEmail` column in request table will support json array to store multiple email addresses.
- Email notification will be sent to requester after the request is reviewed by all approver.

### Deployment
- Client

Prepare `.env` with below variables

```
VITE_BACKEND_BASE_URL=
PORT=
```

Execute below commands to start with Docker

```
cd client
docker build . -t naf-client
docker run -p {port in env}:{port in env} naf-client
```

Due to some bugs from external library, it is not able to build, used development mode instead

- Server

Prepare `.env` with below variables

```
NODE_ENV=production
JWT_SECRET=
PORT=

SMTP_HOST=
SMTP_PORT=
SMTP_USERNAME=
SMTP_PASSWORD=
EMAIL_SENDER=

FRONTEND_URL=
```

Execute below commands to start with Docker

```
cd server
docker build . -t naf-server
docker run -p {port in env}:{port in env} naf-server
```