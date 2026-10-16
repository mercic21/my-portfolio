import "server-only";

/** Sends a notification through Resend if configured. Failures are logged, never thrown. */
export async function notifyNewMessage(msg: { name: string; email: string; body: string }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_TO;
  if (!key || !to) return;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_NOTIFY_FROM || "Portfolio <onboarding@resend.dev>",
        to: [to],
        reply_to: msg.email,
        subject: `New message from ${msg.name}`,
        text: `${msg.name} <${msg.email}>\n\n${msg.body}`,
      }),
    });
    if (!res.ok) console.error("Resend error", res.status, await res.text());
  } catch (err) {
    console.error("Failed to send contact notification", err);
  }
}
