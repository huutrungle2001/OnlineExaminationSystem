import { useEffect, useState } from "react";
import { createContest, deleteContest, getAllContest } from "../../../api/api";
import { useAppSelector } from "../../../store";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Layout from "../../../components/Layout";
import { useNavigate } from "react-router";

const TestManager = () => {
  const navigate = useNavigate();
  const {
    auth: { userDetails },
  } = useAppSelector((state) => state);
  const [contests, setContests] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleNavigate = (path: any) => {
    navigate(path);
  };
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response: any = await getAllContest();
        console.log(response);
        if (response.data.success === true) {
          setContests(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchContests();
  }, [userDetails]);

  const handleCreateContest = async () => {
    try {
      const response: any = await createContest(
        title,
        description,
        userDetails?._id
      );
      if (response.status === 200) {
        setContests([...contests, response.data.contest]);
        setTitle("");
        setDescription("");
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteContest = async (contestId: any) => {
    try {
      const response: any = await deleteContest(contestId);
      if (response.data.success === true) {
        const updatedContests = contests.filter(
          (contest: any) => contest._id !== contestId
        );
        setContests(updatedContests);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewDetails = (contestId: any) => {
    console.log(contestId);
    // Xử lý logic hiển thị chi tiết của cuộc thi với ID contestId
    handleNavigate(`/contest/${contestId}`);
    console.log("View details of contest:", contestId);
  };

  return (
    <Layout>
      <h1>Quản lý đề thi!!!</h1>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Tạo Contest
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Host</TableCell>
              <TableCell>CreatedAt</TableCell>
              <TableCell>UpdatedAt</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contests.map((contest: any) => (
              <TableRow key={contest._id}>
                <TableCell>{contest.title}</TableCell>
                <TableCell>{contest.description}</TableCell>
                <TableCell>{contest.hostId}</TableCell>
                <TableCell>{contest.createdAt}</TableCell>
                <TableCell>{contest.updatedAt}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleDeleteContest(contest._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleViewDetails(contest._id)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Tạo Contest</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateContest}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default TestManager;
