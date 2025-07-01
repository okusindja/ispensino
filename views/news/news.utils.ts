export const formatDate = (
  dateString: string,
  locale: string = 'pt-BR',
  hour12: boolean = false
): string => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12,
  };

  return new Intl.DateTimeFormat(locale, options).format(date);
};
