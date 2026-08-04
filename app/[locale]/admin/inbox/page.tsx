import AdminPlaceholderPage from "@/components/admin/AdminPlaceholderPage";

export default function AdminInboxPage() {
  return (
    <AdminPlaceholderPage
      title="Inbox"
      description="Pregled novih povpraševanj, kontaktnih sporočil in zahtev za poslovno čiščenje."
      items={["Nova povpraševanja", "Kontaktna sporočila", "Status: novo / v obdelavi / zaključeno", "Hitro ustvarjanje ponudbe ali klienta"]}
    />
  );
}
