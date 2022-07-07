import { useState } from "react";

function App() {
  const initEntries = {
    id: null,
    firstName: "Jong",
    lastName: "Lee",
    phoneNumber: "112233"
  }

  const [entries, setEntries] = useState([initEntries]);

  const addEntryToPhoneBook = (entry) => {
    setEntries(
      [...entries, entry].sort((a, b) =>
        a.lastName.localeCompare(b.lastName)
      )
    )
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <EntryForm  />
      <DisplayEntries entries={entries} />
    </div>
  )
}
function EntryForm({ addEntryToPhoneBook }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !phoneNumber) return;
    addEntryToPhoneBook({ firstName, lastName, phoneNumber });
  };
  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div className="d-grid gap-2">
        <input
          className="form-control"
          type="text"
          name="firstName"
          id="firstName"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          className="form-control"
          type="text"
          name="lastName"
          id="lastName"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          className="form-control"
          type="text"
          name="phoneNumber"
          id="phoneNumber"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <div className="d-grid gap-2">
          <button
            className="btn btn-secondary"
            type="submit"
            onSubmit={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}

function DisplayEntries({ entries }) {
  return (
    <table className="table" style={{ marginTop: "1em", width: "400px" }}>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Phone Number</th>
        </tr>
      </thead>
      <tbody style={{ marginTop: ".5em" }}>
        {entries.map((entry) =>
          <tr key={`${entry.firstName} ${entry.lastName}`}>
            <td>{entry.firstName}</td>
            <td>{entry.lastName}</td>
            <td>{entry.phoneNumber}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default App;