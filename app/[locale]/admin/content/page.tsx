import AdminPlaceholderPage from "@/components/admin/AdminPlaceholderPage";

export default function AdminContentPage() {
  return (
    <AdminPlaceholderPage
      title="Content"
      description="Urejanje tekstov spletne strani brez odpiranja VS Code."
      items={["Homepage tekst", "Cleanix Biznis tekst", "FAQ vsebina", "Kontaktni podatki"]}
    />
  );
}
