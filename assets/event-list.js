/**
 * <event-list>: live countdown to the featured event, filter chips by kind,
 * and "Remind me" buttons that download an .ics calendar file.
 */
const pad = (n) => String(Math.max(0, n)).padStart(2, '0');

function icsDate(seconds) {
  return new Date(seconds * 1000).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function icsEscape(text = '') {
  return text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
}

class EventList extends HTMLElement {
  connectedCallback() {
    this.countdown = this.querySelector('[data-countdown]');
    if (this.countdown) {
      this.target = Number(this.countdown.dataset.countdown) * 1000;
      this.units = Object.fromEntries(
        [...this.countdown.querySelectorAll('[data-unit]')].map((el) => [el.dataset.unit, el])
      );
      this.tick();
      this.timer = setInterval(() => this.tick(), 1000);
    }
    this.addEventListener('click', this.onClick);
  }

  disconnectedCallback() {
    clearInterval(this.timer);
  }

  tick() {
    const left = Math.max(0, this.target - Date.now());
    this.units.days.textContent = pad(Math.floor(left / 864e5));
    this.units.hours.textContent = pad(Math.floor(left / 36e5) % 24);
    this.units.minutes.textContent = pad(Math.floor(left / 6e4) % 60);
    this.units.seconds.textContent = pad(Math.floor(left / 1e3) % 60);
    if (!left) clearInterval(this.timer);
  }

  onClick = (event) => {
    const chip = event.target.closest('[data-filter]');
    if (chip) {
      this.filter(chip);
      return;
    }
    const remind = event.target.closest('[data-remind]');
    if (remind) this.download(remind);
  };

  filter(chip) {
    const kind = chip.dataset.filter;
    this.querySelectorAll('[data-filter]').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    this.querySelectorAll('.events__row').forEach((row) => {
      row.hidden = Boolean(kind) && row.dataset.kind !== kind;
    });
  }

  download(button) {
    const { title, start, end, location, url, uid } = button.dataset;
    const startS = Number(start);
    const endS = Number(end) > startS ? Number(end) : startS + 2 * 3600;
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Jumbo Press//Events//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${icsDate(Date.now() / 1000)}`,
      `DTSTART:${icsDate(startS)}`,
      `DTEND:${icsDate(endS)}`,
      `SUMMARY:${icsEscape(title)}`,
      location ? `LOCATION:${icsEscape(location)}` : '',
      url ? `URL:${new URL(url, window.location.origin).href}` : '',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      `DESCRIPTION:${icsEscape(title)}`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].filter(Boolean);

    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'event'}.ics`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);

    button.classList.add('is-set');
    const confirmation = 'short' in button.dataset ? this.dataset.reminderSetShort : this.dataset.reminderSet;
    button.firstChild.textContent = confirmation;
  }
}

if (!customElements.get('event-list')) customElements.define('event-list', EventList);
