# Quiz Lead Email

The quiz posts completed submissions to `/api/quiz-lead`.

The Cloudflare Pages Function sends:

- one internal lead email to `QUIZ_LEAD_TO`
- one visitor receipt email to the quiz taker's email address

## Required Cloudflare Env Vars

```text
RESEND_API_KEY=<resend api key>
QUIZ_LEAD_FROM=Dr. Garber Quiz <drgarber@katek-ai.com>
QUIZ_LEAD_TO=industryrockstarteam@gmail.com
```

For client handoff, change only:

```text
QUIZ_LEAD_TO=office@drgarbers.com
```

## Optional Env Var

Use `QUIZ_LEAD_BCC` when testing needs a copy while the client is the main recipient.

```text
QUIZ_LEAD_BCC=industryrockstarteam@gmail.com
```

Multiple internal recipients can be comma-separated:

```text
QUIZ_LEAD_TO=office@drgarbers.com,nik@katalyst-crm.com
```

After changing any Cloudflare Pages env var, redeploy the Pages project.
