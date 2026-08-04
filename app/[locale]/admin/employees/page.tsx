import AdminPlaceholderPage from "@/components/admin/AdminPlaceholderPage";

export default function AdminEmployeesPage() {
  return (
    <AdminPlaceholderPage
      title="Employees"
      description="Upravljanje čistilcev, managerjev, njihovih vlog, nalog in razpoložljivosti."
      items={["Čistilci in managerji", "Vloge: admin / manager / employee", "Dodeljene naloge", "Razpoložljivost"]}
    />
  );
}
