// 78700000000 -> "₦78.7B"
export const nairaShort = (n: number) =>
  "₦" +
  new Intl.NumberFormat("en-NG", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);

// 234000000000 -> "₦234,000,000,000"
export const nairaFull = (n: number) => "₦" + n.toLocaleString("en-NG");

// 12800 -> "12,800"
export const count = (n: number) => n.toLocaleString("en-NG");

// 23 -> "23rd", 11 -> "11th", 2 -> "2nd"
const withOrdinal = (day: number) => {
  if (day >= 11 && day <= 13) return `${day}th`; // 11th, 12th, 13th are special
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
};

// -> "Friday, 23rd July 2026"
export const longDate = (d = new Date()) => {
  const weekday = d.toLocaleDateString("en-GB", { weekday: "long" });
  const month = d.toLocaleDateString("en-GB", { month: "long" });
  return `${weekday}, ${withOrdinal(d.getDate())} ${month} ${d.getFullYear()}`;
};

// -> "August 2026 to Date" (the small text under "Collections this month")
export const monthToDate = (d = new Date()) => {
  const month = d.toLocaleDateString("en-GB", { month: "long" });
  return `${month} ${d.getFullYear()} to Date`;
};

// '2026-08-08T14:22:23' -> "08 Aug 2026"
export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// '2026-08-08T14:22:23' -> "14:22:23"
export const timeOnly = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB");
