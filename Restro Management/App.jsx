import React, { useState } from "react";

const App = () => {
  const totalSeats = 50; // Total seats available in the restaurant
  const [seatsLeft, setSeatsLeft] = useState(totalSeats);
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    guestCount: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if guest count exceeds available seats
    if (parseInt(formData.guestCount) > seatsLeft) {
      alert("Not enough seats available!");
      return;
    }

    // Check for duplicate names
    const isDuplicate = reservations.some((res) => res.name === formData.name);
    if (isDuplicate) {
      alert("A reservation with this name already exists!");
      return;
    }

    // Create new reservation
    const newReservation = {
      id: Date.now(),
      name: formData.name,
      phone: formData.phone,
      guestCount: parseInt(formData.guestCount),
      checkInTime: new Date().toLocaleTimeString(),
      checkedOut: false,
    };

    // Update state
    setReservations([newReservation, ...reservations]);
    setSeatsLeft(seatsLeft - newReservation.guestCount);

    // Reset form
    setFormData({ name: "", phone: "", guestCount: "" });
  };

  const handleCheckout = (id) => {
    const updatedReservations = reservations.map((res) => {
      if (res.id === id && !res.checkedOut) {
        setSeatsLeft(seatsLeft + res.guestCount); // Add seats back
        return { ...res, checkedOut: true, checkOutTime: new Date().toLocaleTimeString() };
      }
      return res;
    });
    setReservations(updatedReservations);
  };

  const handleDelete = (id) => {
    const reservation = reservations.find((res) => res.id === id);
    if (!reservation.checkedOut) {
      setSeatsLeft(seatsLeft + reservation.guestCount); // Add seats back if not checked out
    }
    const updatedReservations = reservations.filter((res) => res.id !== id);
    setReservations(updatedReservations);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Restaurant Reservation System</h1>
      <p style={styles.seatsLeft}>
        Seats Left: <span style={{ color: seatsLeft < 10 ? "#ff4444" : "#28a745" }}>{seatsLeft}</span>
      </p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <input
          type="number"
          name="guestCount"
          placeholder="Guest Count"
          value={formData.guestCount}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Reserve Table
        </button>
      </form>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.tableHeader}>Name</th>
              <th style={styles.tableHeader}>Phone</th>
              <th style={styles.tableHeader}>Seats Booked</th>
              <th style={styles.tableHeader}>Check-In Time</th>
              <th style={styles.tableHeader}>Checkout Status</th>
              <th style={styles.tableHeader}>Action</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr
                key={res.id}
                style={{
                  ...styles.tableRow,
                  backgroundColor: res.checkedOut ? "#f8f9fa" : "#fff",
                  color: res.checkedOut ? "#6c757d" : "#000",
                }}
              >
                <td style={styles.tableCell}>{res.name}</td>
                <td style={styles.tableCell}>{res.phone}</td>
                <td style={styles.tableCell}>{res.guestCount}</td>
                <td style={styles.tableCell}>{res.checkInTime}</td>
                <td style={styles.tableCell}>
                  {res.checkedOut ? `Checked out at ${res.checkOutTime}` : "Not Checked Out"}
                </td>
                <td style={styles.tableCell}>
                  {!res.checkedOut && (
                    <button
                      onClick={() => handleCheckout(res.id)}
                      style={styles.actionButton}
                    >
                      Click to Checkout
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(res.id)}
                    style={{ ...styles.actionButton, backgroundColor: "#ff4444" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    fontFamily: "'Arial', sans-serif",
    padding: "20px",
    width: "100vw",
    minHeight: "100vh",
    margin: "0 auto",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  heading: {
    color: "#333",
    marginBottom: "20px",
    fontSize: "2rem",
    textAlign: "center",
  },
  seatsLeft: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#555",
    marginBottom: "20px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "20px",
    width: "100%",
    maxWidth: "600px",
  },
  input: {
    padding: "12px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ced4da",
    outline: "none",
    transition: "border-color 0.3s ease",
    width: "100%",
  },
  button: {
    padding: "12px 24px",
    fontSize: "1rem",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    width: "100%",
  },
  tableContainer: {
    width: "100%",
    overflowX: "auto",
    maxWidth: "100vw",
    margin: "0 auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  tableHeaderRow: {
    backgroundColor: "#343a40",
    color: "#fff",
  },
  tableHeader: {
    padding: "12px",
    textAlign: "left",
  },
  tableRow: {
    transition: "background-color 0.3s ease",
  },
  tableCell: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
  },
  actionButton: {
    padding: "8px 12px",
    fontSize: "0.9rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginRight: "5px",
  },
};

export default App;