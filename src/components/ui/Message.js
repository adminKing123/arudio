/** @param {{ text: string, type?: "error" | "success" }} props */
export function Message({ text, type = "error" }) {
  if (!text) {
    return null;
  }

  return <p role={type === "error" ? "alert" : "status"}>{text}</p>;
}
