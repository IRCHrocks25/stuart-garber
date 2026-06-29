# Quiz Lead Email

The quiz posts completed submissions to `/api/quiz-lead`.

The Cloudflare Pages Function sends:

- visitor email
- quiz answers
- recommended protocol
- recommended product link

## Testing Recipient

By default, submissions go to:

```text
jkgramos14@gmail.com
```

## Client Recipient

When testing is approved, set this Cloudflare Pages environment variable:

```text
QUIZ_LEAD_TO=office@drgarbers.com
```

## Required Email Env Vars

```text
RESEND_API_KEY=<resend api key>
QUIZ_LEAD_FROM=<verified sender, optional>
```

If `QUIZ_LEAD_FROM` is not set, the function uses:

```text
Dr. Garber Quiz <onboarding@resend.dev>
```
