export function formatElapsedTime(epochSeconds?: number): string {
  if (!epochSeconds) return '';
  const now = Math.floor(Date.now() / 1000);
  const diff = now - epochSeconds;

  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(diff / 3600);
  const days = Math.floor(diff / 86400);
  const months = Math.floor(diff / (30 * 86400));
  const years = Math.floor(diff / (365 * 86400));

  if (diff < 3600) {
    return `${minutes}m ago`;
  }
  if (diff < 86400) {
    return `${hours}h ago`;
  }
  if (diff < 30 * 86400) {
    return `${days}d ago`;
  }
  if (diff < 12 * 30 * 86400) {
    return `${months}mo ago`;
  }
  return `${years}y ago`;
}
