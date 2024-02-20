import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Layout from "../../../components/Layout";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store";
import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { getAddedContest } from "../../../api/api";

const TestList = () => {
  const navigate = useNavigate();
  //   const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  //   const [dialogOpen, setDialogOpen] = useState(false);
  const handleNavigate = (path: any) => {
    navigate(path);
  };
  const {
    auth: { userDetails },
  } = useAppSelector((state) => state);

  const [contests, setContests] = useState<any[]>([]);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        if (userDetails?._id) {
          const response: any = await getAddedContest(userDetails?._id);
          if (response.status === 200) {
            setContests(response.data.contests);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    const isLoggedIn = userDetails?.token;

    if (!isLoggedIn) {
      navigate("/login");
    }
    fetchContests();
  }, [userDetails, navigate]);

  //   const handleViewDetails = async (question: any) => {
  //     try {
  //       setSelectedQuestion(question);
  //       setDialogOpen(true);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  const handleViewDetails = (contestId: any) => {
    // Xử lý logic hiển thị chi tiết của cuộc thi với ID contestId
    handleNavigate(`/dotest/${contestId}`);
  };

  return (
    <Layout>
      <h1>Danh sách đề thi!!!</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Host</TableCell>
              <TableCell>CreatedAt</TableCell>
              <TableCell>UpdatedAt</TableCell>
              <TableCell>TestResult</TableCell>
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
                <TableCell>{contest.testResult || ''}</TableCell>
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
    </Layout>
  );
};

export default TestList;
