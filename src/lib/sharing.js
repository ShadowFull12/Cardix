import { createTemporaryShare, getTemporaryShare } from "./firestore";

/**
 * Smart Share — generate a share URL with different levels of detail
 */
export function generateShareUrl(username, mode = "full") {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://cardix.app";
  
  switch (mode) {
    case "minimal":
      return `${baseUrl}/card/${username}?share=minimal`;
    case "contact":
      return `${baseUrl}/card/${username}?share=contact`;
    case "full":
    default:
      return `${baseUrl}/card/${username}`;
  }
}

/**
 * Temporary Share — create a time-limited share link
 */
export async function createTempShareLink(uid, minutes = 30) {
  const { shareId, expiresAt } = await createTemporaryShare(uid, minutes);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://cardix.app";
  return {
    url: `${baseUrl}/share/${shareId}`,
    expiresAt,
    shareId,
  };
}

/**
 * Validate a temporary share link
 */
export async function validateTempShare(shareId) {
  return getTemporaryShare(shareId);
}

/**
 * Generate vCard string for "Save to Contacts" 
 */
export function generateVCard(profile) {
  const pub = profile.publicData || {};
  const priv = profile.privateData || {};
  
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${pub.name || ""}`,
    `TITLE:${pub.role || ""}`,
    `NOTE:${pub.bio || ""}`,
  ];
  
  if (priv.phones?.[0]) lines.push(`TEL;TYPE=CELL:${priv.phones[0]}`);
  if (priv.emails?.[0]) lines.push(`EMAIL:${priv.emails[0]}`);
  if (priv.address) lines.push(`ADR:;;${priv.address};;;;`);
  if (pub.socialLinks?.linkedin) lines.push(`URL:${pub.socialLinks.linkedin}`);
  if (pub.socialLinks?.twitter) lines.push(`X-SOCIALPROFILE;TYPE=twitter:${pub.socialLinks.twitter}`);
  
  lines.push(`URL:${typeof window !== "undefined" ? window.location.origin : "https://cardix.app"}/card/${profile.username}`);
  lines.push("END:VCARD");
  
  return lines.join("\n");
}

/**
 * Download vCard file
 */
export function downloadVCard(profile) {
  const vcard = generateVCard(profile);
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${profile.publicData?.name || "contact"}.vcf`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Share via Web Share API or clipboard fallback
 */
export async function shareProfile(username, name) {
  const url = generateShareUrl(username);

  if (navigator.share) {
    try {
      await navigator.share({
        title: `${name}'s Cardix Profile`,
        text: `Check out ${name}'s digital identity card on Cardix`,
        url,
      });
      return true;
    } catch {
      // User cancelled share
      return false;
    }
  }

  // Fallback: copy to clipboard
  await navigator.clipboard.writeText(url);
  return true;
}
