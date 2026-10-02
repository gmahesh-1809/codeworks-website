/**
 * Codeworks website contact form → Google Sheet + email notification.
 * Deploy as a web app (Execute as: Me, Who has access: Anyone). Setup steps: apps-script/README.md.
 *
 * The website posts JSON as text/plain and shows "Thank you" only when this returns {"ok": true}.
 */

const SHEET_NAME = 'Enquiries';
const NOTIFY_EMAIL = 'sales@codeworks.ind.in';
const MIN_FILL_MS = 3000;          // faster than this is treated as a bot
const MAX_PER_HOUR = 30;           // site-wide cap; protects the Sheet and the daily email quota
const MAX_PER_EMAIL_PER_HOUR = 3;

function doPost(e) {
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Bots: report success so they move on, but store nothing.
    if (d.website || Number(d.elapsedMs) < MIN_FILL_MS) return json_({ ok: true });

    const enquiry = {
      name: clean_(d.name, 200),
      organisation: clean_(d.organisation, 200),
      email: clean_(d.email, 320),
      topic: clean_(d.topic, 100),
      message: clean_(d.message, 5000),
      page: clean_(d.page, 500),
    };
    if (!enquiry.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) {
      return json_({ ok: false, error: 'invalid' });
    }
    if (!withinRateLimit_(enquiry.email)) return json_({ ok: false, error: 'busy' });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      sheet_().appendRow([new Date(), enquiry.name, enquiry.organisation, enquiry.email, enquiry.topic, enquiry.message, enquiry.page].map(safeCell_));
    } finally {
      lock.releaseLock();
    }

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: enquiry.email,
      subject: 'Website enquiry: ' + (enquiry.topic || 'General') + ' (' + enquiry.name + ')',
      body: [
        'Name: ' + enquiry.name,
        'Organisation: ' + enquiry.organisation,
        'Email: ' + enquiry.email,
        'Topic: ' + enquiry.topic,
        'Page: ' + enquiry.page,
        '',
        enquiry.message,
      ].join('\n'),
    });

    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server' });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function clean_(value, max) {
  return String(value == null ? '' : value).trim().slice(0, max);
}

// Stops spreadsheet formula injection: a value starting with = + - @ is stored as text.
function safeCell_(value) {
  return typeof value === 'string' && /^[=+\-@]/.test(value) ? "'" + value : value;
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Received', 'Name', 'Organisation', 'Email', 'Topic', 'Message', 'Page']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function withinRateLimit_(email) {
  const cache = CacheService.getScriptCache();
  const hour = Math.floor(Date.now() / 3600000);
  const bump = function (key, max) {
    const n = Number(cache.get(key) || 0) + 1;
    cache.put(key, String(n), 3600);
    return n <= max;
  };
  return bump('all:' + hour, MAX_PER_HOUR) && bump('email:' + email.toLowerCase() + ':' + hour, MAX_PER_EMAIL_PER_HOUR);
}
