import React from "react";
import useFetch from "../../hooks/useFetch";
import "./featuredProperties.scss";

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

const FeaturedProperties = () => {
  const { data, loading } = useFetch<IHotel>("/hotels?featured=true&limit=4");
  return (
    <div className="fp">
      {loading
        ? "Loading, please wait"
        : data.map((item) => (
            <div className="fpItem" key={item._id}>
              <img
                src={
                  item.photos[0]
                    ? item.photos[0]
                    : "https://cf.bstatic.com/xdata/images/hotel/square600/13125860.webp?k=e148feeb802ac3d28d1391dad9e4cf1e12d9231f897d0b53ca067bde8a9d3355&o=&s=1"
                }
                alt="fp-1"
                className="fpImg"
              />
              <span className="fpName">{item.name}</span>
              <span className="fpCity">{item.city}</span>
              <span className="fpPrice">Starting from $120</span>
              {item.rating && (
                <div className="fpRating">
                  <button>{item.rating}</button>
                  <span>Excellent</span>
                </div>
              )}
            </div>
          ))}
    </div>
  );
};

export default FeaturedProperties;
