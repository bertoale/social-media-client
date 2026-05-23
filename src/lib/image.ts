import { Cloudinary } from "@cloudinary/url-gen";
import { API_URL, CLOUDINARY_CLOUD_NAME } from "./config";

const cld = new Cloudinary({
  cloud: { cloudName: CLOUDINARY_CLOUD_NAME },
});

/**
 * Extract public_id from full Cloudinary URL
 * Example: https://res.cloudinary.com/dyjbyj9eh/image/upload/v1779518693/social-media/avatars/qqyzzjkiowksbch2anf0.jpg
 * Returns: social-media/avatars/qqyzzjkiowksbch2anf0
 */
function extractPublicIdFromUrl(url: string): string | null {
  try {
    // Match pattern: /upload/v{version}/{publicId}.{ext}
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.[a-zA-Z]+$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export function getImageUrl(path: string | undefined | null): string | undefined {
  if (!path) return undefined;

  // If it's a full Cloudinary URL, extract public_id and regenerate with SDK
  if (path.includes("res.cloudinary.com")) {
    const publicId = extractPublicIdFromUrl(path);
    if (publicId) {
      return cld.image(publicId).toURL();
    }
    // Fallback to original URL if extraction fails
    return path;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/uploads/")) {
    return API_URL + path;
  }

  // Assume it's a public_id, generate URL with Cloudinary SDK
  return cld.image(path).toURL();
}
