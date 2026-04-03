export function calculateProgress(currentAmount: number, targetAmount: number) {
  if (targetAmount <= 0) return 0;
  return Math.min((currentAmount / targetAmount) * 100, 100);
}
