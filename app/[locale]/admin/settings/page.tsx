import AdminPlaceholderPage from "@/components/admin/AdminPlaceholderPage";

export default function AdminSettingsPage() {
  return (
    <AdminPlaceholderPage
      title="Settings"
      description="Glavne nastavitve sistema, plačil, e-pošte, uporabnikov in varnosti."
      items={["Online plačilo ON/OFF", "Telefon in e-pošta", "Uporabniki in vloge", "Območje delovanja"]}
    />
  );
}
