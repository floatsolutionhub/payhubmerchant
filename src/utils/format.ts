// 78700000000 -> "₦78.7B"
export const nairaShort = (n: number) =>
  "₦" +
  new Intl.NumberFormat("en-NG", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);

export const nairaFull = (n: number) => "₦" + n.toLocaleString("en-NG");

export const count = (n: number) => n.toLocaleString("en-NG");

const withOrdinal = (day: number) => {
  if (day >= 11 && day <= 13) return `${day}th`;
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

export const longDate = (d = new Date()) => {
  const weekday = d.toLocaleDateString("en-GB", { weekday: "long" });
  const month = d.toLocaleDateString("en-GB", { month: "long" });
  return `${weekday}, ${withOrdinal(d.getDate())} ${month} ${d.getFullYear()}`;
};

export const monthToDate = (d = new Date()) => {
  const month = d.toLocaleDateString("en-GB", { month: "long" });
  return `${month} ${d.getFullYear()} to Date`;
};

export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const timeOnly = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB");

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const monthShort = (isoDate: string) =>
  MONTH_NAMES[Number(isoDate.slice(5, 7)) - 1];
