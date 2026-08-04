import AdminPlaceholderPage from "@/components/admin/AdminPlaceholderPage";

export default function AdminGalleryPage() {
  return (
    <AdminPlaceholderPage
      title="Gallery"
      description="Upravljanje slik za spletno stran, storitve, business stran in promocije."
      items={["Slike za homepage", "Slike storitev", "Business slike", "Aktivne / skrite slike"]}
    />
  );
}
