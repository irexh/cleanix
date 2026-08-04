import AdminPlaceholderPage from "@/components/admin/AdminPlaceholderPage";

export default function AdminServicesPage() {
  return (
    <AdminPlaceholderPage
      title="Services"
      description="Upravljanje storitev, cen, dodatkov, popustov in statusov aktivno / kmalu."
      items={["Cene čiščenja", "Dodatne storitve", "Popusti za redno čiščenje", "Aktivno ali kmalu"]}
    />
  );
}
