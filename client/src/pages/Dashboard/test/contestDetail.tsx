import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import {
  creatMCQ,
  createFillInBlankQuest,
  deleteFill,
  getContestDetail,
} from "../../../api/api";
import { useParams } from "react-router";
import Paper from "@mui/material/Paper";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

const ContestDetails = () => {
  const [contestDetail, setContestDetail] = useState<any>();
  const { contestId } = useParams();
  const [openFill, setOpenFill] = useState(false);
  const [openMCQ, setOpenMCQ] = useState(false);
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [numberRange, setNumberRange] = useState<number>(0);
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [d, setD] = useState("");
  const [correct, setCorrect] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  const handleNumberRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberRange(Number(e.target.value));
  };

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response: any = await getContestDetail(contestId);
        if (response.data.success === true) {
          setContestDetail(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchContests();
  }, [contestId]);

  const handleCreateFill = async () => {
    try {
      const formData = new FormData();
      formData.append("image", file as File);
      formData.append("numberRange", String(numberRange));
      formData.append("question", question);
      console.log("form:", formData);
      const res: any = await createFillInBlankQuest(contestId, formData);
      console.log(res);
      if (res.data.success === true) {
        contestDetail.fillInBlankQuests.push(res.data.data);
        setOpenFill(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateMCQ = async () => {
    try {
      const formData = new FormData();
      formData.append("image", file as File);
      formData.append("question", question);
      formData.append("a", a);
      formData.append("b", b);
      formData.append("c", c);
      formData.append("d", d);
      formData.append("correctOption", correct);
      const res: any = await creatMCQ(contestId, formData);
      if (res.data.success === true) {
        contestDetail.mcqQuests.push(res.data.data);
        setOpenMCQ(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewDetails = async (questionId: string) => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (fillInBlankQuestId: string) => {
    try {
      const res: any = await deleteFill(contestId, fillInBlankQuestId);
      console.log(res.data.success === true);
      if (res) {
        const updatedFillInBlankQuests =
          contestDetail?.fillInBlankQuests.filter(
            (question: any) => question._id !== fillInBlankQuestId
          );
        setContestDetail((prevContestDetail: any) => ({
          ...prevContestDetail,
          fillInBlankQuests: updatedFillInBlankQuests,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <h2>Contest Details</h2>
      <p>Title: {contestDetail?.title}</p>
      <p>Description: {contestDetail?.description}</p>
      <p>Host ID: {contestDetail?.hostId}</p>
      <p>Created At: {contestDetail?.createdAt}</p>
      <p>Updated At: {contestDetail?.updatedAt}</p>

      {/* Hiển thị fillInBlankQuests */}
      <Button variant="contained" onClick={() => setOpenFill(true)}>
        Create Fill in Blank Questions
      </Button>
      <h3>Fill in Blank Questions:</h3>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Number Range</TableCell>
              <TableCell>CreatedAt</TableCell>
              <TableCell>UpdatedAt</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contestDetail?.fillInBlankQuests.map(
              (question: any, index: number) => (
                <TableRow key={question._id}>
                  <TableCell>{question.question}</TableCell>
                  <TableCell>
                    {question.imageBase64 && (
                      <img
                        src={`data:image/jpeg;base64,${question.imageBase64}`}
                        alt="Question Image"
                      />
                    )}
                  </TableCell>
                  <TableCell>{question.numberRange}</TableCell>
                  <TableCell>{question.createdAt}</TableCell>
                  <TableCell>{question.updatedAt}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleDelete(question._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleViewDetails(question._id)}
                    >
                      Edit Details
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Hiển thị mcqQuests */}
      <Button variant="contained" onClick={() => setOpenMCQ(true)}>
        Create Multiple Choice Questions
      </Button>
      <h3>Multiple Choice Questions:</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>A</TableCell>
              <TableCell>B</TableCell>
              <TableCell>C</TableCell>
              <TableCell>D</TableCell>
              <TableCell>CreatedAt</TableCell>
              <TableCell>UpdatedAt</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contestDetail?.mcqQuests.map((question: any, index: number) => (
              <TableRow key={question._id}>
                <TableCell>{question.question}</TableCell>
                <TableCell>
                  {question.imageBase64 && (
                    <img
                      src={`data:image/jpeg;base64,${question.imageBase64}`}
                      alt="Question Image"
                    />
                  )}
                </TableCell>
                <TableCell>{question?.a}</TableCell>
                <TableCell>{question?.b}</TableCell>
                <TableCell>{question?.c}</TableCell>
                <TableCell>{question?.d}</TableCell>
                <TableCell>{question.createdAt}</TableCell>
                <TableCell>{question.updatedAt}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleDelete(question._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleViewDetails(question._id)}
                  >
                    Edit Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openFill} onClose={() => setOpenFill(false)}>
        <DialogTitle>Tạo Fill</DialogTitle>
        <DialogContent>
          <TextField
            label="Question"
            variant="outlined"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Number Range"
            variant="outlined"
            type="number"
            value={numberRange}
            onChange={handleNumberRangeChange}
            fullWidth
            margin="normal"
          />
          <input type="file" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFill(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateFill}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openMCQ} onClose={() => setOpenMCQ(false)}>
        <DialogTitle>Create Multiple Choice Questions</DialogTitle>
        <DialogContent>
          <TextField
            label="Question"
            variant="outlined"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="A"
            variant="outlined"
            value={a}
            onChange={(e) => setA(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="B"
            variant="outlined"
            value={b}
            onChange={(e) => setB(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="C"
            variant="outlined"
            value={c}
            onChange={(e) => setC(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="D"
            variant="outlined"
            value={d}
            onChange={(e) => setD(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Correct answer"
            variant="outlined"
            value={correct}
            onChange={(e) => setCorrect(e.target.value)}
            fullWidth
            margin="normal"
          />
          <input type="file" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMCQ(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateMCQ}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default ContestDetails;
