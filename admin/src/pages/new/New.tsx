import { DriveFolderUploadOutlined } from "@mui/icons-material";
import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./new.scss";
import { useNavigate } from "react-router";

interface NewProps {
  inputs: {
    id: string | number;
    label: string;
    type: string;
    placeholder?: string | undefined;
  }[];
  title: string;
}

interface ISetInfo {
  id: number;
  label: string;
  type: string;
  placeholder?: string | undefined;
  img?: string;
}

const New: React.FC<NewProps> = ({ inputs, title }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [info, setInfo] = useState<ISetInfo>({ id: 0, label: "", type: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInfo((prevState: ISetInfo) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file!);
    data.append("api_key", "<INSERT_YOUR_API>");
    data.append("upload_preset", "vuihjy42");
    try {
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/cserver/image/upload",
        data
      );
      const { url } = uploadRes.data;
      const newUser = {
        ...info,
        img: url,
      };
      await axios.post("/auth/register", newUser);
      navigate("/users");
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
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
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
                  id="file"
                  onChange={(e) => setFile(e.target.files && e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id as string}
                  />
                </div>
              ))}
              {/* <div className="formInput">
                <label>Name and surname</label>
                <input type="text" placeholder="John Doe" />
              </div>
              <div className="formInput">
                <label>Email</label>
                <input type="email" placeholder="john_doe@mail.com" />
              </div>
              <div className="formInput">
                <label>Phone</label>
                <input type="text" placeholder="+1 234 567 890" />
              </div>
              <div className="formInput">
                <label>Password</label>
                <input type="password" />
              </div>
              <div className="formInput">
                <label>Address</label>
                <input type="text" placeholder="Elton St. 216 New York" />
              </div>
              <div className="formInput">
                <label>Country</label>
                <input type="text" placeholder="USA" />
              </div> */}
              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
