import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { SearchContext } from "../../context/SearchContext";
import useFetch from "../../hooks/useFetch";
import "./reserve.scss";

// interface ICustomDate extends Date {
//   getTime(start?: number): Date;
//   getDate() : Number;
// }

interface IReserve {
  hotelId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IRoom {
  title: string;
  price: number;
  maxPeople: number;
  desc: string;
  roomNumbers: [{ _id: string; number: number; unavailableDates: [Date] }];
}

const Reserve: React.FC<IReserve> = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const { data, loading } = useFetch<IRoom>(`/hotels/room/${hotelId}`);
  const navigate = useNavigate();
  const { dates } = useContext(SearchContext);

  const getDateInRange = (startDate: any, endDate: any) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const date = new Date(start.getTime());

    let list = [];
    while (date <= end) {
      list.push(new Date(date).toString());
      date.setDate(date.getDate() + 1);
    }
    return list;
  };

  const allDates = getDateInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber: {
    number: number;
    unavailableDates: [Date];
  }) => {
    const isFound = roomNumber.unavailableDates.some((date) => {
      return allDates.includes(new Date(date).toString());
    });
    return !isFound;
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((room) => room !== value)
    );
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await Promise.all(
        selectedRooms.map((roomId) => {
          const res = axios.put(`/rooms/availability/${roomId}`, {
            dates: allDates,
          });
        })
      );
    } catch (error) {}
    setOpen(false);
    navigate("/");
  };

  return (
    <div className="reserve">
      {loading ? (
        "Loading, please wait"
      ) : (
        <div className="rContainer">
          <FontAwesomeIcon
            icon={faCircleXmark}
            className="rClose"
            onClick={() => setOpen(false)}
          />
          <span>Select your rooms:</span>
          {data.length > 1 &&
            data.map((item, index) => (
              <div className="rItem" key={index}>
                <div className="rInfo">
                  <div className="rTitle">{item.title}</div>
                  <div className="rDesc">{item.desc}</div>
                  <div className="rMax">
                    Max people: <b>{item.maxPeople}</b>
                  </div>
                  <div className="rPrice">${item.price}</div>
                </div>
                <div className="rSelectRooms">
                  {item.roomNumbers.map((room, index) => (
                    <div className="room" key={index}>
                      <label>{room.number}</label>
                      <input
                        type="checkbox"
                        value={room._id}
                        onChange={handleSelect}
                        disabled={!isAvailable(room)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          <button onClick={handleClick} className="rButton">
            Reserve Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Reserve;
