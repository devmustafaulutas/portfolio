import { redirect } from "next/navigation";

export default function SnippetsPage() {
  redirect("/blog#snippets");
}