const DEFAULT_TO = 'jkgramos14@gmail.com';
const CLIENT_TO = 'office@drgarbers.com';
const DEFAULT_FROM = 'Dr. Garber Quiz <onboarding@resend.dev>';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function answerLines(answers) {
  if (!Array.isArray(answers)) return '';
  return answers
    .map((item) => {
      const selected = Array.isArray(item.answers) ? item.answers : [];
      const lines = selected.map((answer) => `- ${answer.text || ''} (${answer.tag || ''})`);
      return `Q${item.question}: ${item.prompt || ''}\n${lines.join('\n')}`;
    })
    .join('\n\n');
}

function answerHtml(answers) {
  if (!Array.isArray(answers)) return '';
  return answers
    .map((item) => {
      const selected = Array.isArray(item.answers) ? item.answers : [];
      const list = selected
        .map((answer) => `<li>${escapeHtml(answer.text || '')} <em>(${escapeHtml(answer.tag || '')})</em></li>`)
        .join('');
      return `<h3>Q${escapeHtml(item.question || '')}: ${escapeHtml(item.prompt || '')}</h3><ul>${list}</ul>`;
    })
    .join('');
}

export async function onRequestPost({ request, env }) {
  if (!env.RESEND_API_KEY) {
    return json({ error: 'Email service is not configured' }, 500);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const email = String(payload.email || '').trim();
  if (!isEmail(email)) return json({ error: 'Valid email is required' }, 400);

  const resultTitle = String(payload.resultTitle || 'Quiz result').trim();
  const productLink = String(payload.productLink || '').trim();
  const productCta = String(payload.productCta || 'View recommended product').trim();
  const recipient = env.QUIZ_LEAD_TO || DEFAULT_TO;
  const sender = env.QUIZ_LEAD_FROM || DEFAULT_FROM;

  const subject = `Dr. Garber quiz lead: ${email}`;
  const text = [
    `New Dr. Garber quiz lead`,
    ``,
    `Email: ${email}`,
    `Result: ${resultTitle}`,
    `Product CTA: ${productCta}`,
    `Product link: ${productLink}`,
    ``,
    `Quiz answers:`,
    answerLines(payload.answers),
    ``,
    `Testing recipient: ${DEFAULT_TO}`,
    `Client recipient when ready: ${CLIENT_TO}`,
  ].join('\n');

  const html = `
    <h2>New Dr. Garber quiz lead</h2>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Result:</strong> ${escapeHtml(resultTitle)}</p>
    <p><strong>Recommended product:</strong> <a href="${escapeHtml(productLink)}">${escapeHtml(productCta)}</a></p>
    <hr>
    <h2>Quiz answers</h2>
    ${answerHtml(payload.answers)}
    <hr>
    <p><strong>Current recipient:</strong> ${escapeHtml(recipient)}</p>
    <p><strong>Client recipient when ready:</strong> ${escapeHtml(CLIENT_TO)}</p>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      reply_to: email,
      subject,
      text,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    return json({ error: 'Email send failed', detail: body }, 502);
  }

  return json({ ok: true });
}
