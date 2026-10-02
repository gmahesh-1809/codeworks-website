# Contact form backend (Google Apps Script)

The contact form posts to a Google Apps Script web app. The script stores each enquiry in a Google Sheet and emails `sales@codeworks.ind.in`. The website only shows "Thank you" when the script confirms the enquiry was saved; otherwise it shows an error with the email address.

Until the web-app URL is configured, the form opens the visitor's email program instead.

## Set up (about 10 minutes)

1. Sign in to the Google account that should own the enquiries, preferably a Codeworks Google Workspace account rather than a personal one.
2. Create a new Google Sheet, for example "Website enquiries".
3. In the Sheet, open **Extensions → Apps Script**.
4. Replace the contents of `Code.gs` with [`Code.gs`](Code.gs) from this folder. Check `NOTIFY_EMAIL` at the top.
5. Click **Deploy → New deployment**, choose type **Web app**, and set:
   - **Execute as:** Me
   - **Who has access:** Anyone
6. Click **Deploy** and approve the permissions it asks for (access to this spreadsheet and sending email as you).
7. Copy the **Web app URL** (it ends in `/exec`).
8. In this repository, paste it into `formEndpoint` in [`src/_data/site.js`](../src/_data/site.js), then commit and push.
9. Send a test enquiry from the live site. It should appear as a row in the "Enquiries" sheet and as an email.

## Updating the script later

Use **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. This keeps the same URL. Creating a *new deployment* instead gives a new URL, which would then need updating in `site.js`.

## Spam and abuse protection

- **Hidden spam-trap field:** a field visitors can't see. Submissions with it filled in are reported as successful but not stored.
- **Minimum fill time:** forms submitted in under 3 seconds are treated the same way.
- **Rate limits:** at most 30 enquiries per hour site-wide, and 3 per hour per email address. Both can be changed at the top of `Code.gs`.
- **Formula-injection protection:** values that start with `= + - @` are stored as plain text, so they can't run as spreadsheet formulas.

If spam still gets through, add Cloudflare Turnstile (a free CAPTCHA alternative) to the form and verify its token in the script.

## Quotas

Apps Script can send about 100 emails a day from a free Gmail account and about 1,500 from Google Workspace. The site-wide rate limit keeps well below this.

## Privacy

Enquiries are personal data stored in Google Workspace. The Privacy Policy (`src/privacy/index.md`) describes this. Decide on a retention period and delete old rows to match it.
