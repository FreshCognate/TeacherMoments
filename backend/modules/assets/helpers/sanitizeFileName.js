export default (filename) => {
  filename = filename.normalize("NFKD");

  // Remove unsafe characters (allow only letters, numbers, dashes, underscores, and periods)
  filename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");

  // Prevent leading/trailing dots or spaces
  filename = filename.replace(/^[.\s]+|[.\s]+$/g, "");

  // Enforce length limit
  return filename.substring(0, 255);
}