import AdminPlaceholderPage from "@/components/admin/AdminPlaceholderPage";

export default function AdminClientsPage() {
  return (
    <AdminPlaceholderPage
      title="Clients"
      description="Upravljanje zasebnih strank, njihovih kontaktov, naslovov in zgodovine rezervacij."
      items={["Ime, e-pošta in telefon", "Zgodovina rezervacij", "Opombe o stranki", "Povezava z objekti in termini"]}
    />
  );
}
