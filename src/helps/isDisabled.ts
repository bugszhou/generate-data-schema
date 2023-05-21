export default function isDisabled(content: string) {
  if (content?.includes("@data2schema-disabled")) {
    return true;
  }

  return false;
}
