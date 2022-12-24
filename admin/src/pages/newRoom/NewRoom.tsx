import React, { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { roomInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import "./newRoom.scss";

interface ISetInfo {
  id: number;
  label: string;
  type: string;
  placeholder?: string | undefined;
  img?: string;
}

interface IHotel {
  _id: string;
  name: string;
  type: string;
  city: string;
  address: string;
  distance: string;
  photos: [string];
  title: string;
  desc: string;
  rating: number;
  rooms: [string];
  cheapest: number;
  featured: boolean;
}

const NewRoom: React.FC = () => {
  const [info, setInfo] = useState<ISetInfo>({ id: 0, label: "", type: "" });
  const [rooms, setRooms] = useState<string>("");
  const { data, loading } = useFetch<IHotel>("/hotels");
  const [hotelId, setHotelId] = useState<string>("");

  useEffect(() => {
    if (data.length > 0) {
      setHotelId(data[0]._id);
    }
  }, [data]);
  console.log(info);
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    console.log([e.target.id], e.target.value);
    setInfo((prevState: ISetInfo) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const roomNumbers = rooms.split(",").map((room) => ({ number: room }));
    try {
      await axios.post(`/rooms/${hotelId}`, { ...info, roomNumbers });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Room</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form>
              {roomInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    type={input.type}
                    onChange={handleChange}
                    placeholder={input.placeholder}
                    id={input.id}
                  />
                </div>
              ))}
              <div className="formInput">
                <label>Rooms</label>
                <textarea
                  onChange={(e) => setRooms(e.target.value)}
                  placeholder="give comma between room numbers"
                />
              </div>
              <div className="formInput">
                <label>Choose a hotel</label>
                <select
                  id="hotelId"
                  onChange={(e) => setHotelId(e.target.value)}
                >
                  {loading
                    ? "Loading, please wait"
                    : data &&
                      data.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                </select>
              </div>
              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;
