import { useEffect, useState } from "react";
import { deleteUser, getAllUser } from "../../../api/api";
import { useAppSelector } from "../../../store";
import Button from "@mui/material/Button";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Layout from "../../../components/Layout";
import { useNavigate } from "react-router-dom";

const UserManager = () => {
  const {
    auth: { userDetails },
  } = useAppSelector((state) => state);
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUser(userDetails?._id);
        if (response.users.success === true) {
          setUsers(response.users.users);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const isLoggedIn = userDetails?.token;

    if (!isLoggedIn) {
      navigate("/login");
    }
    fetchUsers();
  }, [userDetails, navigate]);
  

  const handleDeleteUser = async (userId: any) => {
    try {
      const response: any = await deleteUser(userId);
      if (response.data.success === true) {
        const updatedUsers = users.filter((user: any) => user._id !== userId);
        setUsers(updatedUsers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <h1>Quản lý người dùng!!!</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>CreatedAt</TableCell>
              <TableCell>UpdatedAt</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell>{user.updatedAt}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
};

export default UserManager;
