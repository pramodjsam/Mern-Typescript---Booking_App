import { DriveFolderUploadOutlined } from "@mui/icons-material";
import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { hotelInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import "./newHotel.scss";

interface ISetInfo {
  id: number;
  label: string;
  type: string;
  placeholder?: string | undefined;
  img?: string;
}

interface IRoom {
  _id: string;
  title: string;
  price: number;
  maxPeople: number;
  desc: string;
  roomNumber: [{ number: number; unavailableDates: [Date] }];
}

interface IFile extends File {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

const NewHotel = () => {
  const [files, setFiles] = useState<FileList | any>(null);
  const [info, setInfo] = useState<ISetInfo>({ id: 0, label: "", type: "" });
  const [rooms, setRooms] = useState<string[]>();
  const [featured, setFeatured] = useState<boolean>(false);
  const { data, loading } = useFetch<IRoom>("/rooms");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setInfo((prevState: ISetInfo) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = Array.from(
      e.target.selectedOptions,
      (options) => options.value
    );
    setRooms(value);
  };

  const handleFeatured = (e: ChangeEvent<HTMLSelectElement>) => {
    setFeatured(Boolean(e.target.value));
  };

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const list = await Promise.all(
        Object.values(files).map(async (file: IFile | any): Promise<string> => {
          const data = new FormData();
          data.append("file", file!);
          data.append("api_key", "E8ld6i8qRjVV2pXDvHoabhQlXLs");
          data.append("upload_preset", "vuihjy42");
          const uploadRes = await axios.post(
            "https://api.cloudinary.com/v1_1/cserver/image/upload",
            data
          );
          const { url } = uploadRes.data;
          return url;
        })
      );
      const newHotel = {
        ...info,
        featured,
        rooms,
        photos: list,
      };
      await axios.post("/hotels", newHotel);
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
          <h1>Add New Hotel</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                files
                  ? URL.createObjectURL(files[0])
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt="user"
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlined className="icon" />
                </label>
                <input
                  type="file"
                  multiple
                  id="file"
                  onChange={(e) => setFiles(e.target.files && e.target.files)}
                  style={{ display: "none" }}
                />
              </div>
              {hotelInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                  />
                </div>
              ))}
              <div className="formInput">
                <label>Featured</label>
                <select id="featured" onChange={handleFeatured}>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              <div className="selectRooms">
                <label>Rooms</label>
                <select id="rooms" multiple onChange={handleSelect}>
                  {loading
                    ? "Loading, please wait"
                    : data.map((item) => (
                        <option value={item._id} key={item._id}>
                          {item.title}
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

export default NewHotel;
