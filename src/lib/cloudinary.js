/**
 * Cloudinary Unsigned Upload Utility
 * Assumes the user has configured NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME 
 * and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.
 */

export async function uploadToCloudinary(file) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration missing in .env.local");
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file to Cloudinary");
  }

  const data = await response.json();
  
  return {
    url: data.secure_url,
    publicId: data.public_id,
    format: data.format,
    resourceType: data.resource_type,
    bytes: data.bytes,
    name: file.name,
  };
}
