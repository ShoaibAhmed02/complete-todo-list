// ... (other imports)
import React, { useEffect, useState } from "react";
import { IoTrashBinSharp } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import moment from "moment";
import axios from "axios";

const style = {
  color: "red",
  display: "flex",
  justifyContent: "center",
};

function App() {
  const [item, setItem] = useState("");
  const [data, setData] = useState([]);
  const [onDelete, setOnDelete] = useState(1);
  const [check, setCheck] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  const checkValues = (event) => {
    const value = event.target.value;
    setItem(value);
  };

  const addingValues = async () => {
    if (!check) {
      if (item.trim() !== "") {
        const newItem = {
          name: item,
          date: moment().format("DD/MM/YYYY, HH:mm:ss"),
        };

        const updatedList = [...data, newItem];
        setData(updatedList);
        setItem("");
        const response = await axios
          .post("http://localhost:3000/data", { item: newItem })
          .catch(function (error) {
            console.log(error.toJSON());
          });
        console.log("sending data : ", response);
      }
    } else {
      // Handle editing logic here
      if (item.trim() !== "" && editingItemId) {
        const updatedData = data.map((existingItem) => {
          if (existingItem._id === editingItemId) {
            return { ...existingItem, name: item };
          }
          return existingItem;
        });
        setData(updatedData);

        // Perform the update using editingItemId and item
        const response = await axios
          .post(`http://localhost:3000/edit-item/${editingItemId}`, { name: item })
          .catch(function (error) {
            console.log(error.toJSON());
          });
        console.log("updating data : ", response);
      }

      setCheck(false);
      setItem("");
      setEditingItemId(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/get-data");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [onDelete]);

  return (
    <div>
      <div style={style}>
        <input
          onChange={checkValues}
          value={item}
          placeholder="Enter the product name.."
          type="text"
        />
        <button onClick={addingValues} type="submit">
          {check ? "Update" : "ADD"}
        </button>
      </div>

      {data.map((item, index) => (
        <li
          style={{
            border: "5px solid #800059",
            height: "50px",
            width: "40%",
            color: "#1d2c39",
            backgroundColor: "-moz-initial",
            display: "flex",
            fontFamily: "cursive",
            justifyContent: "space-around",
            marginBottom: "10px",
          }}
          key={index}
        >
          {index} <span> {item.index} </span>
          {item.name}{" "}
          <span
            onClick={async () => {
              const deletee = await axios.post(
                `http://localhost:3000/delete-item/${item._id}`
              );
              setOnDelete(onDelete + 1);
            }}
          >
            Delete <IoTrashBinSharp />
          </span>{" "}
          <span>
            Edit
            <CiEdit
              onClick={() => {
                setCheck(true);
                setItem(item.name);
                setEditingItemId(item._id);
                setOnDelete(delete+1)
              }}
            />
          </span>
          <span>{item.date}</span>
        </li>
      ))}
    </div>
  );
}

export default App;

