export function formatCelular(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (!digits.length) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)})${digits.slice(2)}`;
  if (digits.length <= 10) {
    const local = digits.slice(2);
    return `(${digits.slice(0, 2)})${local.slice(0, 4)}-${local.slice(4)}`;
  }
  const local = digits.slice(2);
  return `(${digits.slice(0, 2)})${local.slice(0, 5)}-${local.slice(5)}`;
}
