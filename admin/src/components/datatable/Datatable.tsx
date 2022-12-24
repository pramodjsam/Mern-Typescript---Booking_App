import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { IUserColumns, IUserRows } from "../../dataTableSource";
import "./datatable.scss";
import { Link, useLocation } from "react-router-dom";
import { GridRenderCellParams } from "@mui/x-data-grid/models/params";
import useFetch from "../../hooks/useFetch";

interface IDataTableProps {
  columns?: IUserColumns[];
}

const Datatable: React.FC<IDataTableProps> = ({ columns }) => {
  // const [data, setData] = useState(userRows);
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [list, setList] = useState<IUserRows[]>();
  const { data, loading } = useFetch<IUserRows>(`/${path}`);

  useEffect(() => {
    setList(data);
  }, [data]);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/${path}/${id}`);
    } catch (error) {
      console.log(error);
    }
    setList((item) => item!.filter((item) => item._id !== id));
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params: GridRenderCellParams<any, any, any>) => {
        return (
          <div className="cellAction">
            <Link to="/users/test" style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        {path.split("")[0].toUpperCase() + path.slice(1)}
        <Link
          to={`/${path}/new`}
          className="link"
          style={{ textDecoration: "none" }}
        >
          Add New
        </Link>
      </div>
      {loading ? (
        "Loading, please wait"
      ) : (
        <DataGrid
          className="datagrid"
          rows={list!}
          columns={columns!.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
          getRowId={(row) => row._id}
        />
      )}
    </div>
  );
};

export default Datatable;
