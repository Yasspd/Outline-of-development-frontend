const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'long',
});

const fullDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

export function formatShortDate(value: string) {
  return dateFormatter.format(new Date(value));
}

export function formatFullDate(value: string) {
  return fullDateFormatter.format(new Date(value));
}

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

