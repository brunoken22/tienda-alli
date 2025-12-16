import { ResponseUpload } from "@/types/product";

function isResponseUpload(img: ResponseUpload | null): img is ResponseUpload {
  return (
    img != null &&
    typeof img === "object" &&
    typeof img.public_id === "string" &&
    typeof img.url === "string"
  );
}

export default isResponseUpload;
