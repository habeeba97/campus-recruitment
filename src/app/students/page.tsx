import { createClient } from "@/lib/supabase/server";
import { addStudent } from "./actions";

export default async function StudentsPage() {
  const supabase = await createClient();
  const { data: students } = await supabase.from("students").select("*").order("id", { ascending: false });

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>Student Registration Form</h2>
      <form action={addStudent} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "8px", marginBottom: "2rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.85rem" }}>Full Name</label>
          <input name="name" required style={{ width: "100%", padding: "0.4rem", marginTop: "0.2rem" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.85rem" }}>Email Address</label>
          <input name="email" type="email" required style={{ width: "100%", padding: "0.4rem", marginTop: "0.2rem" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.85rem" }}>Department</label>
          <input name="department" placeholder="e.g. Computer Science" required style={{ width: "100%", padding: "0.4rem", marginTop: "0.2rem" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.85rem" }}>CGPA</label>
          <input name="cgpa" type="number" step="0.01" min="0" max="10" required style={{ width: "100%", padding: "0.4rem", marginTop: "0.2rem" }} />
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <button type="submit" style={{ padding: "0.6rem 1.2rem", background: "#059669", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>Register Student</button>
        </div>
      </form>

      <h3>Registered Students List</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
            <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Name</th>
            <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Email</th>
            <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Dept</th>
            <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>CGPA</th>
          </tr>
        </thead>
        <tbody>
          {students && students.length > 0 ? (
            students.map((s) => (
              <tr key={s.id}>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{s.name}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{s.email}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{s.department}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{s.cgpa}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ padding: "1rem", textAlign: "center", color: "#6b7280" }}>Abhi koi student register nahi hua hai.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
