import React, { useState } from "react";
import { useLocation } from "react-router";
import { format } from "date-fns";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import "./list.scss";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";

interface LocationStateProps {
  date: any;
  destination: string;
  options: {
    adult: number;
    children: number;
    room: number;
  };
}

const List = () => {
  const { date, destination, options } = useLocation()
    .state as LocationStateProps;
  const [state, setState] = useState({ date, destination, options });
  const [openDate, setOpenDate] = useState(false);

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
                  <input type="number" className="lsOptionInput" />
                </div>

                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input type="number" className="lsOptionInput" />
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
            <button>Search</button>
          </div>
          <div className="listResult">
            <SearchItem />
            <SearchItem />
            <SearchItem />
            <SearchItem />
            <SearchItem />
            <SearchItem />
            <SearchItem />
            <SearchItem />
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
