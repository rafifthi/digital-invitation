export const INVITATION_DOMAIN = "riuhmerekah.com";

export function sanitizeSubdomain(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+/, "")
    .slice(0, 48);
}

export function invitationSubdomain(host: string) {
  const normalizedHost = host
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .split("/")[0];

  if (normalizedHost === INVITATION_DOMAIN) return "";
  if (normalizedHost.endsWith(`.${INVITATION_DOMAIN}`)) {
    return normalizedHost.slice(0, -(`.${INVITATION_DOMAIN}`.length));
  }

  return sanitizeSubdomain(normalizedHost.split(".")[0] ?? "");
}

export function invitationHost(subdomain: string) {
  const normalizedSubdomain = sanitizeSubdomain(subdomain);
  return normalizedSubdomain
    ? `${normalizedSubdomain}.${INVITATION_DOMAIN}`
    : INVITATION_DOMAIN;
}

export function invitationUrl(host: string) {
  return `https://${invitationHost(invitationSubdomain(host))}`;
}
