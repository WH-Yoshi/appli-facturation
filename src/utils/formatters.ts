export const formatCurrency = (amount: number): string => new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
}).format(amount);

export const formatDateMonth = (moisAnnee: string): string => {
  const [year, month] = moisAnnee.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
};