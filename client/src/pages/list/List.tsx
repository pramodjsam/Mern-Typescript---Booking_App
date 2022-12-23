import React, { useState } from "react";
import { useLocation } from "react-router";
import { format } from "date-fns";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import "./list.scss";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";

interface LocationStateProps {
  date: any;
  destination: string;
  options: {
    adult: number;
    children: number;
    room: number;
  };
}

export interface IHotel {
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

const List = () => {
  const { date, destination, options } = useLocation()
    .state as LocationStateProps;
  const [state, setState] = useState({ date, destination, options });
  const [openDate, setOpenDate] = useState(false);
  const [min, setMin] = useState<undefined | number | string>(undefined);
  const [max, setMax] = useState<undefined | number | string>(undefined);
  const { data, loading, reFetchData } = useFetch<IHotel>(
    `/hotels?city=${state.destination}&min=${min || 0}&max=${max || 999}`
  );

  const handleClick = () => {
    reFetchData();
  };

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label htmlFor="destination">Destination</label>
              <input
                type="text"
                id="destination"
                placeholder={state.destination}
                onChange={(e) =>
                  setState({ ...state, destination: e.target.value })
                }
              />
            </div>
            <div className="lsItem">
              <label htmlFor="destination">Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                state.date[0].startDate,
                "MM/dd/yyyy"
              )} to ${format(state.date[0].endDate, "MM/dd/yyyy")}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) =>
                    setState({ ...state, date: [item.selection] })
                  }
                  ranges={state.date}
                  minDate={new Date()}
                />
              )}
            </div>

            <div className="lsItem">
              <label htmlFor="options">Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    onChange={(e) => setMin(e.target.value)}
                    className="lsOptionInput"
                  />
                </div>

                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    onChange={(e) => setMax(e.target.value)}
                    className="lsOptionInput"
                  />
                </div>

                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={state.options.adult.toString()}
                  />
                </div>

                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    placeholder={state.options.children.toString()}
                  />
                </div>

                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={state.options.room.toString()}
                  />
                </div>
              </div>
            </div>
            <button onClick={handleClick}>Search</button>
          </div>
          <div className="listResult">
            {loading
              ? "Loading, please wait"
              : data.map((item) => <SearchItem item={item} key={item._id} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
