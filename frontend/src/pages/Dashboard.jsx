function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Welcome {user?.fullName}</p>

      <p>Role: {user?.role}</p>
    </div>
  );
}

export default Dashboard;