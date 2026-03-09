import React from "react";

function Patients() {

  const patientList = [
    { id: 1, name: "Ravi Kumar", age: 32, disease: "Fever" },
    { id: 2, name: "Sneha Reddy", age: 28, disease: "Diabetes" },
    { id: 3, name: "Arjun Rao", age: 45, disease: "Heart Problem" },
    { id: 4, name: "Priya Sharma", age: 30, disease: "Migraine" }
  ];

  return (
    <div className="page">
      <h1>Patients List</h1>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Disease</th>
          </tr>
        </thead>

        <tbody>
          {patientList.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.disease}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default Patients;