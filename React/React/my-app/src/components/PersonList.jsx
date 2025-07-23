import { useState } from "react";
import "./PersonList.css";
import User from "./User";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

function PersonList({ data, deleteUser }) {
  const [show, steShow] = useState(true);
  return (
    <div className="container">
      <div className="header">
        <h2 style={{ color: "red", fontSize: "25px" }}>
          จำนวนประชากร {data.length} คน
        </h2>
        <span onClick={() => steShow(!show)}>
          {show ? <IoMdEye size={30} /> : <IoMdEyeOff size={30} />}
        </span>
      </div>
      <ul>
        {show &&
          data.map((item) => (
            <User key={item.id} item={item} deleteUser={deleteUser} />
          ))}
      </ul>
    </div>
  );
}

export default PersonList;
