export function padLeft(dateValue: number) {
  return dateValue < 10 ? '0' + dateValue : dateValue.toString();
}
