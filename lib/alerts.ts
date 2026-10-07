/**
 * Lightweight alert helper for production failures.
 *
 * Posts to a Discord webhook (or Slack-compatible webhook with `username` / `content`).
 * If no webhook URL is configured, it just logs to console and returns — so adding alerting
 * later is zero-risk: nothing breaks if the env var is missing.
 *
 * Set ALERT_WEBHOOK_URL in Vercel env to enable:
 * - Discord: create a webhook in any channel (Server Settings → Integrations → Webhooks → New)
 * - Slack: use an Incoming Webhook URL
 * - Both accept `{ content: "..." }` JSON payloads.
 *
 * Set ALERT_DISCORD_USER_ID to a Discord user snowflake (right-click your name → Copy User ID)
 * so failure alerts ping that user. Several ids can be comma-separated.
 */
function discordMentions() {
  const ids = (process.env.ALERT_DISCORD_USER_ID ?? '')
    .split(',')
    .map(id => id.trim())
    .filter(id => /^\d{15,22}$/.test(id))
  return ids
}

export async function notifyAlert(opts: {
  /** Short title shown bold at the top of the alert */
  title: string
  /** Body text — supports Markdown for Discord/Slack */
  body: string
  /** Severity — affects formatting (emoji prefix). Defaults to 'warn'. */
  severity?: 'info' | 'warn' | 'error'
}): Promise<void> {
  const url = process.env.ALERT_WEBHOOK_URL
  const emoji = opts.severity === 'error' ? '🚨' : opts.severity === 'info' ? 'ℹ️' : '⚠️'
  const mentions = discordMentions()
  const ping = mentions.length ? mentions.map(id => `<@${id}>`).join(' ') + '\n' : ''
  const fullMessage = `${ping}${emoji} **${opts.title}**\n${opts.body}`

  // Always log to console so the alert is visible in Vercel logs even without webhook
  console.warn(`[ALERT] ${opts.title} — ${opts.body}`)

  if (!url) return

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: fullMessage,
        ...(mentions.length ? { allowed_mentions: { users: mentions } } : {}),
      }),
    })
  } catch (err) {
    // Don't let alert delivery failures break the caller
    console.error('[ALERT] Failed to deliver webhook:', err)
  }
}
