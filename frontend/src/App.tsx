import { useEffect, useState } from "react";

interface SchoolClass {
  id: string;
  name: string;
  totalSeats: number;
  heldSeats: number;
  confirmedSeats: number;
  availableSeats: number;
}

function App() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("http://localhost:8080/classes")

        if (!response.ok) {
          throw new Error("Faild to fetch classes");
        }

        const data: SchoolClass[] = await response.json();
        setClasses(data);
      } catch {
        setError("Could not load classes.")
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [])

  const isValidStudentId = /^[0-9]{17}$/.test(studentId);
  return (
    <div>
      <h1>School Admission System</h1>

      <div>
        <h2>Student Information</h2>
        {classes.length === 0 ? (
          <p>No classes available</p>
        ) : (
          classes.map((schoolClass) => (
            <div key={schoolClass.id}>
              <h3>{schoolClass.name}</h3>
              <p>Total Seats: {schoolClass.totalSeats}</p>
              <p>Held Seats: {schoolClass.heldSeats}</p>
              <p>Confirmed Seats: {schoolClass.confirmedSeats}</p>
              <p>Available Seats: {schoolClass.availableSeats}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App