import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("");

  // 🔹 Load tasks
  const loadTasks = async () => {
    const snapshot = await getDocs(collection(db, "tasks"));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setTasks(data);
  };

  // 🔹 Load user role
  const loadUserRole = async (email) => {
    const q = query(collection(db, "users"), where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("User not found → default member");
      setRole("member");
      return;
    }

    snapshot.forEach(doc => {
      setRole(doc.data().role);
    });
  };

  // 🔹 Add task (admin only)
  const addTask = async () => {
    if (!title) return alert("Enter task");

    await addDoc(collection(db, "tasks"), {
      title,
      status: "todo"
    });

    setTitle("");
    loadTasks();
  };

  // 🔹 Mark task done
  const markDone = async (id) => {
    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, {
      status: "done"
    });
    loadTasks();
  };

  // 🔹 Auth check
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Logged in:", user.email);
        loadUserRole(user.email);
        loadTasks();
      }
    });
  }, []);

  // 🔹 Prevent loading freeze
  if (!role) return <h3>Loading...</h3>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Dashboard ({role})</h2>

      <input
        style={{
          padding: "8px",
          marginRight: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc"
        }}
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {role === "admin" && (
        <button
          onClick={addTask}
          style={{
            padding: "8px 12px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}
        >
          Add Task
        </button>
      )}

      <h3 style={{ marginTop: "20px" }}>Tasks:</h3>

      {tasks.map((t) => (
        <div
          key={t.id}
          style={{
            background: "#f5f5f5",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <span>
            {t.title} - <b>{t.status}</b>
          </span>

          {t.status !== "done" && (
            <button
              onClick={() => markDone(t.id)}
              style={{
                backgroundColor: "green",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "5px"
              }}
            >
              Done
            </button>
          )}
        </div>
      ))}
    </div>
  );
}