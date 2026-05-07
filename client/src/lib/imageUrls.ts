const cloudinaryUploadMarker = "/image/upload/";

type CloudinaryImageOptions = {
  width: number;
  height?: number;
  crop?: "fill" | "limit";
};

export const getOptimizedImageUrl = (
  imageUrl: string,
  { width, height, crop = "limit" }: CloudinaryImageOptions,
) => {
  const trimmedUrl = imageUrl.trim();
  if (!trimmedUrl.includes(cloudinaryUploadMarker)) return trimmedUrl;

  const transforms = [
    "f_auto",
    "q_auto",
    `c_${crop}`,
    `w_${width}`,
    height ? `h_${height}` : null,
  ]
    .filter(Boolean)
    .join(",");

  return trimmedUrl.replace(
    cloudinaryUploadMarker,
    `${cloudinaryUploadMarker}${transforms}/`,
  );
};
