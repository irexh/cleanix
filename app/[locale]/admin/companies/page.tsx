import AdminPlaceholderPage from "@/components/admin/AdminPlaceholderPage";

export default function AdminCompaniesPage() {
  return (
    <AdminPlaceholderPage
      title="Companies"
      description="Baza podjetij, kontaktnih oseb in poslovnih dogovorov za Cleanix Biznis."
      items={["Podjetje in davčni podatki", "Kontaktne osebe", "Pogodbe in dogovori", "Objekti podjetja"]}
    />
  );
}
