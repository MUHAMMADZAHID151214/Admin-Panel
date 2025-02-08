import AdminDashboard from "./admin/dashboard/page";
import AdminLogin from "./admin/page";

export default function Home() {
  return (
    <div>
      <AdminLogin></AdminLogin>
      <AdminDashboard></AdminDashboard>
    </div>
  );
}
