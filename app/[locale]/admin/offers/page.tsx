import AdminPlaceholderPage from "@/components/admin/AdminPlaceholderPage";

export default function AdminOffersPage() {
  return (
    <AdminPlaceholderPage
      title="Offers"
      description="Priprava ponudb za poslovne stranke, ogled prostorov in dogovori za redno čiščenje."
      items={["Ponudbe za podjetja", "Brezplačen ogled prostora", "Status ponudbe", "Pretvorba v redni termin"]}
    />
  );
}
