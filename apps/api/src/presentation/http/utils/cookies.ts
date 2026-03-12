export function getCookieValue(cookieHeader: string | undefined, name: string): string | undefined {
  if (!cookieHeader) {
    return undefined;
  }

  const parts = cookieHeader.split(';').map(part => part.trim());
  const target = `${name}=`;
  const found = parts.find(part => part.startsWith(target));
  if (!found) {
    return undefined;
  }

  return decodeURIComponent(found.slice(target.length));
}
