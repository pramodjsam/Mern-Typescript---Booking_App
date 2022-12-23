import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";
import Reserve from "../../components/reserve/Reserve";
import { AuthContext } from "../../context/AuthContext";
import { SearchContext } from "../../context/SearchContext";
import useFetch from "../../hooks/useFetch";
import { IHotel } from "../list/List";
import "./hotel.scss";

const Hotel = () => {
  const location = useLocation();
  const pathname = location.pathname.split("/")[2];
  const [sliderNumber, setSliderNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  let { data, loading } = useFetch<IHotel>(`/hotels/find/${pathname}`);
  const { dates, options } = useContext(SearchContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  function dateDifference(date1: Date, date2: Date) {
    const MILLI_SECOND_PER_DAY = 1000 * 60 * 60 * 24;
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLI_SECOND_PER_DAY);
    return diffDays;
  }

  const days = dateDifference(dates[0]?.endDate, dates[0]?.startDate);

  const photos = [
    {
      src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261707778.jpg?k=56ba0babbcbbfeb3d3e911728831dcbc390ed2cb16c51d88159f82bf751d04c6&o=&hp=1",
    },
    {
      src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261707367.jpg?k=cbacfdeb8404af56a1a94812575d96f6b80f6740fd491d02c6fc3912a16d8757&o=&hp=1",
    },
    {
      src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261708745.jpg?k=1aae4678d645c63e0d90cdae8127b15f1e3232d4739bdf387a6578dc3b14bdfd&o=&hp=1",
    },
    {
      src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261707776.jpg?k=054bb3e27c9e58d3bb1110349eb5e6e24dacd53fbb0316b9e2519b2bf3c520ae&o=&hp=1",
    },
    {
      src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261708693.jpg?k=ea210b4fa329fe302eab55dd9818c0571afba2abd2225ca3a36457f9afa74e94&o=&hp=1",
    },
    {
      src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261707389.jpg?k=52156673f9eb6d5d99d3eed9386491a0465ce6f3b995f005ac71abc192dd5827&o=&hp=1",
    },
  ];

  const handleOpen = (index: number) => {
    setSliderNumber(index);
    setOpen(true);
  };

  const handleMove = (direction: string) => {
    let newSlideNumber: number;

    if (direction === "l") {
      newSlideNumber =
        sliderNumber === 0 ? photos.length - 1 : sliderNumber - 1;
    } else {
      newSlideNumber =
        sliderNumber === photos.length - 1 ? 0 : sliderNumber + 1;
    }

    setSliderNumber(newSlideNumber);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (user) {
      setOpenModal(true);
    } else {
      navigate("/login");
    }
  };

  return (
    <div>
      <Navbar />
      <Header type="list" />
      {loading
        ? "Loading, please wait"
        : data && (
            <div className="hotelContainer">
              {open && (
                <div className="slider">
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    className="close"
                    onClick={() => setOpen(false)}
                  />
                  <FontAwesomeIcon
                    icon={faCircleArrowLeft}
                    className="arrow"
                    onClick={() => handleMove("l")}
                  />
                  <div className="sliderWrapper">
                    <img
                      src={photos[sliderNumber].src}
                      alt={sliderNumber.toString()}
                      className="sliderImg"
                    />
                  </div>
                  <FontAwesomeIcon
                    icon={faCircleArrowRight}
                    className="arrow right"
                    onClick={() => handleMove("r")}
                  />
                </div>
              )}
              <div className="hotelWrapper">
                <button className="bookNow">Reserve or Book Now!</button>
                <h1 className="hotelTitle">{data[0].name}</h1>
                <div className="hotelAddress">
                  <FontAwesomeIcon icon={faLocationDot} />
                  <span>{data[0].address}</span>
                </div>
                <span className="hotelDistance">
                  Excellent location - {data[0].distance}m from center
                </span>
                <span className="hotelPriceHightlight">
                  Book a stay over ${data[0].cheapest} at this property and get
                  a free airport taxi
                </span>
                <div className="hotelImages">
                  {photos.map((photo, index) => (
                    <div key={index} className="hotelImgWrapper">
                      <img
                        onClick={() => handleOpen(index)}
                        src={photo.src}
                        className="hotelImg"
                        alt={index.toString()}
                      />
                    </div>
                  ))}
                </div>
                <div className="hotelDetails">
                  <div className="hotelDetailsText">
                    <h1 className="hotelTitle">{data[0].title}</h1>
                    <p className="hotelDesc">{data[0].desc}</p>
                  </div>
                  <div className="hotelDetailsPrice">
                    <h1>Perfect for a 9-night stay!</h1>
                    <span>
                      Located in the real heart of Krakow, this property has an
                      excellent location score of 9.8!
                    </span>
                    <h2>
                      <b>${days * data[0].cheapest * options.room}</b> ({days}{" "}
                      nights)
                    </h2>
                    <button onClick={handleClick}>Reserve or Book Now!</button>
                  </div>
                </div>
              </div>
              <MailList />
              <Footer />
            </div>
          )}
      {openModal && <Reserve hotelId={pathname} setOpen={setOpenModal} />}
    </div>
  );
};

export default Hotel;
