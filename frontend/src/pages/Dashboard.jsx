import { useEffect, useState, useCallback } from "react";
import { HiOutlineUserCircle } from "react-icons/hi2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTheme } from "../useTheme";
import "../App.css";
import "../responsive.css";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const { dark, setDark } = useTheme();
  const tasksPerPage = 5;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get("https://task-manager-backend-h48y.onrender.com/api/tasks", { headers });
      setTasks(res.data);
    } catch {
      toast.error("Failed to load tasks");
    }
  }, [token]);

  useEffect(() => {
    if (!token) navigate("/");
    else fetchTasks();
  }, [token, navigate, fetchTasks]);

  const addTask = async () => {
    if (!form.title) return toast.error("Title is required!");
    if (editTask) {
      await updateTask();
    } else {
      await axios.post("https://task-manager-backend-h48y.onrender.com/api/tasks", form, { headers });
      toast.success("Task added!");
      setForm({ title: "", description: "" });
      setCurrentPage(1);
      fetchTasks();
    }
  };

  const updateTask = async () => {
    try {
      await axios.put(`https://task-manager-backend-h48y.onrender.com/api/tasks/${editTask._id}`, form, { headers });
      toast.success("Task updated!");
      setForm({ title: "", description: "" });
      setEditTask(null);
      fetchTasks();
    } catch {
      toast.error("Failed to update task!");
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setForm({ title: task.title, description: task.description || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditTask(null);
    setForm({ title: "", description: "" });
  };

  const deleteTask = async (id) => {
    await axios.delete(`https://task-manager-backend-h48y.onrender.com/api/tasks/${id}`, { headers });
    toast.success("Task deleted!");
    fetchTasks();
  };

  const toggleTask = async (id) => {
    await axios.patch(`https://task-manager-backend-h48y.onrender.com/api/tasks/${id}/toggle`, {}, { headers });
    fetchTasks();
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const deleteAccount = async () => {
    try {
      await axios.delete("https://task-manager-backend-h48y.onrender.com/api/auth/delete", { headers });
      toast.success("Account deleted!");
      localStorage.clear();
      navigate("/");
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const pending = tasks.filter((t) => t.status === "pending").length;
  const completed = tasks.filter((t) => t.status === "completed").length;

  const filteredTasks = tasks.filter(task => {
    const matchSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ? true :
      filter === "pending" ? task.status === "pending" :
      task.status === "completed";
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const currentTasks = filteredTasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  // Dark mode styles
  const bg = dark ? '#0f172a' : '#f5f5f5';
  const cardBg = dark ? '#1e293b' : '#fff';
  const borderColor = dark ? '#334155' : '#e5e7eb';
  const textColor = dark ? '#e2e8f0' : '#222';
  const subText = dark ? '#94a3b8' : '#888';

  return (
    <>
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
            <h3 style={{ color: textColor }}>Delete Account?</h3>
            <p style={{ color: subText }}>All tasks and account data will be permanently deleted.</p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button
                className="delete-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  deleteAccount();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ minHeight: "100vh", background: bg }}>

        {/* Navbar */}
        <div className="navbar" style={{ background: cardBg, borderBottom: `1px solid ${borderColor}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <img
              src="/logo.png"
              alt="Task Manager Logo"
              style={{ width: "25px", height: "25px", borderRadius: "50%", objectFit: "cover" }}
            />
            <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#1e3a8a", margin: 0 }}>
              Task Manager
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDark(!dark)}
              style={{
                background: 'transparent',
                border: `1px solid ${borderColor}`,
                padding: '6px 12px',
                fontSize: '13px',
                color: dark ? '#e2e8f0' : '#555',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
  {dark ? (
    <>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
      Light
    </>
  ) : (
    <>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
      Dark
    </>
  )}
</span>
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <HiOutlineUserCircle size={28} color="#2563eb" />
              <span style={{ fontSize: "14px", color: dark ? '#e2e8f0' : '#555', fontWeight: "600" }}>
                {localStorage.getItem("name")}
              </span>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              style={{
                background: "transparent",
                color: "#dc2626",
                border: "1px solid #dc2626",
                padding: "6px 14px",
                fontSize: "13px",
              }}
            >
              Delete Account
            </button>
            <button
              onClick={logout}
              style={{
                background: "transparent",
                color: "#dc2626",
                border: "1px solid #dc2626",
                padding: "6px 14px",
                fontSize: "13px",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="container">

          {/* Stats */}
          <div className="stats">
            {[
              { label: "Total Tasks", value: tasks.length, color: "#2563eb" },
              { label: "Pending", value: pending, color: "#d97706" },
              { label: "Completed", value: completed, color: "#16a34a" },
            ].map((stat) => (
              <div key={stat.label} className="stat-card" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                <div style={{ fontSize: "24px", fontWeight: "700", color: stat.color }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "13px", color: subText, marginTop: "4px" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Add / Edit Task */}
          <div className="add-task-box" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
            <h3 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "14px", color: textColor }}>
              {editTask ? "Edit Task" : "Add New Task"}
            </h3>
            <input
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              <button onClick={addTask}>
                {editTask ? "Update Task" : "Add Task"}
              </button>
              {editTask && (
                <button
                  onClick={handleCancelEdit}
                  style={{
                    background: "transparent",
                    color: "#6b7280",
                    border: "1px solid #6b7280",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Search & Filter */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, position: "relative", minWidth: "200px" }}>
              <svg
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                placeholder="Search tasks..."
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ paddingLeft: "38px", margin: 0 }}
              />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {["all", "pending", "completed"].map(f => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setCurrentPage(1); }}
                  style={{
                    background: filter === f ? "#2563eb" : cardBg,
                    color: filter === f ? "#fff" : dark ? '#e2e8f0' : '#555',
                    border: `1px solid ${filter === f ? '#2563eb' : borderColor}`,
                    padding: "8px 16px",
                    fontSize: "13px",
                    fontWeight: filter === f ? "600" : "400",
                  }}
                >
                  {f === "all" ? "All" : f === "pending" ? "Pending" : "Completed"}
                </button>
              ))}
            </div>
          </div>

          {/* Task List Heading */}
          <h3 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "14px", color: textColor }}>
            All Tasks
          </h3>

          {/* No Tasks */}
          {filteredTasks.length === 0 && (
            <div style={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: "8px",
              padding: "40px",
              textAlign: "center",
              color: subText,
              fontSize: "14px",
            }}>
              {search ? "No tasks found for your search." : "No tasks yet. Add one above."}
            </div>
          )}

          {/* Tasks */}
          {currentTasks.map((task) => (
            <div
              key={task._id}
              className="task-card"
              style={{
                background: cardBg,
                border: `1px solid ${borderColor}`,
                borderLeft: `4px solid ${task.status === "completed" ? "#16a34a" : "#2563eb"}`,
              }}
            >
              <div>
                <p style={{
                  fontWeight: "500",
                  fontSize: "15px",
                  textDecoration: task.status === "completed" ? "line-through" : "none",
                  color: task.status === "completed" ? subText : textColor,
                }}>
                  {task.title}
                </p>
                {task.description && (
                  <p style={{ fontSize: "13px", color: subText, marginTop: "4px" }}>
                    {task.description}
                  </p>
                )}
                <span style={{
                  display: "inline-block",
                  marginTop: "8px",
                  fontSize: "11px",
                  padding: "3px 10px",
                  borderRadius: "20px",
                  background: task.status === "completed" ? "#dcfce7" : "#dbeafe",
                  color: task.status === "completed" ? "#16a34a" : "#2563eb",
                  fontWeight: "500",
                }}>
                  {task.status === "completed" ? "Completed" : "Pending"}
                </span>
              </div>

              <div className="task-buttons">
                <button
                  onClick={() => toggleTask(task._id)}
                  style={{
                    background: task.status === "pending" ? "#16a34a" : "#d97706",
                    padding: "7px 14px",
                    fontSize: "12px",
                  }}
                >
                  {task.status === "pending" ? "Complete" : "Undo"}
                </button>
                <button
                  onClick={() => handleEdit(task)}
                  style={{ background: "#2563eb", padding: "7px 14px", fontSize: "12px" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  style={{ background: "#dc2626", padding: "7px 14px", fontSize: "12px" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              marginTop: "24px",
              marginBottom: "32px"
            }}>
              <button
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
                style={{
                  background: currentPage === 1 ? "#e5e7eb" : "#2563eb",
                  color: currentPage === 1 ? "#aaa" : "#fff",
                  padding: "8px 16px",
                  fontSize: "13px",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer"
                }}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    background: currentPage === i + 1 ? "#2563eb" : cardBg,
                    color: currentPage === i + 1 ? "#fff" : dark ? '#e2e8f0' : '#333',
                    border: `1px solid ${borderColor}`,
                    padding: "8px 14px",
                    fontSize: "13px",
                    fontWeight: currentPage === i + 1 ? "600" : "400"
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === totalPages}
                style={{
                  background: currentPage === totalPages ? "#e5e7eb" : "#2563eb",
                  color: currentPage === totalPages ? "#aaa" : "#fff",
                  padding: "8px 16px",
                  fontSize: "13px",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer"
                }}
              >
                Next
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}