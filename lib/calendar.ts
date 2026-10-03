import { BRAND } from "./brand";

function icsDate(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
}

const escapeText = (s: string) => s.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;");

/** Downloads an .ics file the visitor can open in Apple, Google, or Outlook calendar. */
export function downloadCalendarFile(
  c: { title: string; start: Date | string; end: Date | string; location: string },
  orderNumber: string,
) {
  const start = new Date(c.start);
  const end = new Date(c.end);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${BRAND.name}//Celebrations//EN`,
    "BEGIN:VEVENT",
    `UID:${orderNumber}@${BRAND.name.toLowerCase()}`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${escapeText(c.title)}`,
    `LOCATION:${escapeText(c.location)}`,
    `DESCRIPTION:${BRAND.name} order ${orderNumber}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${c.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
