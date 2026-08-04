import AdminPlaceholderPage from "@/components/admin/AdminPlaceholderPage";

export default function AdminPropertiesPage() {
  return (
    <AdminPlaceholderPage
      title="Properties"
      description="Lokacije čiščenja: stanovanja, hiše, pisarne, saloni, lokali in drugi poslovni prostori."
      items={["Naslov in mesto", "Tip prostora", "Velikost in posebnosti", "Povezava s klientom ali podjetjem"]}
    />
  );
}
