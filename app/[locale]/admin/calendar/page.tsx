import AdminPlaceholderPage from "@/components/admin/AdminPlaceholderPage";

export default function AdminCalendarPage() {
  return (
    <AdminPlaceholderPage
      title="Calendar"
      description="Planiranje terminov, dodeljevanje dela ekipi in pregled zasedenosti."
      items={["Dnevni in tedenski pregled", "Dodelitev zaposlenega", "Status dela", "Blokirani termini in dopusti"]}
    />
  );
}
