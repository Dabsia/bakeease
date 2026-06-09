export function createPageUrl(pageName) {
  return "/" + pageName.replace(/ /g, "-");
}

export function generatePaymentReference() {
  const date = new Date();
  const datePart = [
    date.getFullYear().toString().slice(-2),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `BE-${datePart}-${randomPart}`;
}

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('en-US', { month: 'long' });
  const day = date.getDate();
  const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3 || Math.floor(day % 100 / 10) === 1) ? 0 : day % 10];
  return `${month} ${day}${suffix}`;
};