import "./AddFrom.css";
import { useState } from "react";
export default function AddFrom(props) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("ชาย");

  const { data, setData } = props;

  function saveData(e) {
    e.preventDefault();
    const person = {
      id: data.length + 1,
      name: name,
      gender: gender,
    };
    console.log(person);
    setData([...data, person]);
    setName("");
    setGender("ชาย");
  }
  return (
    <section className="container">
      <form onSubmit={saveData}>
        <label>ชื่อประชากร</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option>ชาย</option>
          <option>หญิง</option>
        </select>
        <button
          type="submit"
          className="btn-save"
          disabled={name.trim() === ""}
        >
          บันทึก
        </button>
      </form>
    </section>
  );
}
