const API_URL = "http://localhost:5000/api";
let doctorModal;
let allDoctors = [];

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    showDashboard();
  } else {
    document.getElementById("loginSection").style.display = "block";
    document.getElementById("dashboardSection").style.display = "none";
  }

  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        if (data.user && data.user.role !== "admin") {
          alert("Lỗi 403: Tài khoản của bạn không có quyền Admin!");
          return;
        }
        localStorage.setItem("adminToken", data.token);
        showDashboard();
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  });

  doctorModal = new bootstrap.Modal(document.getElementById('doctorModal'));
  document.getElementById("doctorForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    await saveDoctor();
  });
});

function showDashboard() {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("dashboardSection").style.display = "block";
  loadDoctors();
  loadBookings();
}

function logout() {
  localStorage.removeItem("adminToken");
  location.reload();
}

function showTab(tabId) {
  document.getElementById("doctorsTab").style.display = tabId === 'doctors' ? "block" : "none";
  document.getElementById("bookingsTab").style.display = tabId === 'bookings' ? "block" : "none";
  document.querySelectorAll(".sidebar a").forEach(a => a.classList.remove("active"));
  event.target.classList.add("active");
}

async function loadDoctors() {
  try {
    const res = await fetch(`${API_URL}/doctors`);
    const doctors = await res.json();
    const tbody = document.getElementById("doctorsTableBody");
    tbody.innerHTML = "";
    
    doctors.forEach(doc => {
      tbody.innerHTML += `
        <tr>
          <td>${doc.name}</td>
          <td>${doc.specialty}</td>
          <td>${doc.price}</td>
          <td>${doc.experience} yrs</td>
          <td>${doc.rating || 0} ⭐</td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="openDoctorModalById('${doc._id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteDoctor('${doc._id}')">Delete</button>
          </td>
        </tr>
      `;
    });
    allDoctors = doctors;
  } catch (err) {
    console.error("Error loading doctors:", err);
  }
}

function openDoctorModalById(id) {
  const doc = allDoctors.find(d => d._id === id);
  openDoctorModal(doc);
}

function openDoctorModal(doc = null) {
  if (doc) {
    document.getElementById("doctorModalTitle").innerText = "Edit Doctor";
    document.getElementById("doctorId").value = doc._id;
    document.getElementById("docName").value = doc.name;
    document.getElementById("docSpecialty").value = doc.specialty;
    document.getElementById("docPrice").value = doc.price;
    document.getElementById("docExperience").value = doc.experience;
  } else {
    document.getElementById("doctorModalTitle").innerText = "Add Doctor";
    document.getElementById("doctorForm").reset();
    document.getElementById("doctorId").value = "";
  }
  doctorModal.show();
}

async function saveDoctor() {
  const id = document.getElementById("doctorId").value;
  const name = document.getElementById("docName").value;
  const specialty = document.getElementById("docSpecialty").value;
  const price = document.getElementById("docPrice").value;
  const experience = document.getElementById("docExperience").value;

  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/doctors/${id}` : `${API_URL}/doctors`;
  const token = localStorage.getItem("adminToken");

  try {
    const res = await fetch(url, {
      method,
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ name, specialty, price: Number(price), experience: Number(experience), qualification: "N/A" })
    });
    
    if (res.ok) {
      alert("Doctor saved successfully!");
      doctorModal.hide();
      loadDoctors();
    } else {
      const data = await res.json();
      alert("Error: " + data.message);
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
}

async function deleteDoctor(id) {
  if(!confirm("Are you sure you want to delete this doctor?")) return;
  
  try {
    const token = localStorage.getItem("adminToken");
    const res = await fetch(`${API_URL}/doctors/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    if (res.ok) {
      alert("Doctor deleted");
      loadDoctors();
    } else {
      const data = await res.json();
      alert("Failed: " + data.message);
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
}

async function loadBookings() {
  try {
    const token = localStorage.getItem("adminToken");
    const res = await fetch(`${API_URL}/admin/bookings`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    // Assuming backend returns an array or an object with bookings array
    const bookings = Array.isArray(data) ? data : (data.bookings || []);
    const tbody = document.getElementById("bookingsTableBody");
    tbody.innerHTML = "";
    
    bookings.forEach(b => {
      tbody.innerHTML += `
        <tr>
          <td>${b.patientName}</td>
          <td>${b.doctorId ? b.doctorId.name || b.doctorId : 'N/A'}</td>
          <td>${new Date(b.date).toLocaleDateString()}</td>
          <td>${b.time}</td>
          <td><span class="badge bg-${b.status === 'completed' ? 'success' : 'warning'}">${b.status}</span></td>
          <td>${b.paymentStatus}</td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("Error loading bookings:", err);
  }
}
