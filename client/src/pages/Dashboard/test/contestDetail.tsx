import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import {
  addUserToContest,
  creatMCQ,
  createFillInBlankQuest,
  deleteFill,
  getContestDetail,
  getUsers,
  updateFillInBlankQuest,
  updateMCQQuest,
} from "../../../api/api";
import MenuItem from "@mui/material/MenuItem";
import { useParams } from "react-router";
import Paper from "@mui/material/Paper";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Select,
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [imageBase64, setImageBase64] = useState<any>(true);
  const [dialogMCQOpen, setDialogMCQOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);

  const handleImageClose = () => {
    setSelectedQuestion((prevQuestion: any) => ({
      ...prevQuestion,
      imageBase64: null,
    }));
    setImageBase64(false);
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  const handleNumberRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberRange(Number(e.target.value));
  };

  const handleAddUserToContest = async (users: any, contestDetail: any) => {
    try {
      const res: any = await addUserToContest(users, contestDetail._id);
      if (res.status === 200) {
        console.log("add user success");
        // ....
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response: any = await getContestDetail(contestId);
        if (response.data.success === true) {
          setContestDetail(response.data.data);
          setSelectedUser(response.data.data.participant);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getAllUser = async () => {
      try {
        const response: any = await getUsers();
        if (response?.users?.success === true) {
          const options = response.users.users.map((user: any) => ({
            value: user._id,
            label: user.email,
          }));
          setAllUser(options);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAllUser();
    fetchContests();
  }, [contestId]);

  const handleCreateFill = async () => {
    try {
      const formData = new FormData();
      formData.append("image", file as File);
      formData.append("numberRange", String(numberRange));
      formData.append("question", question);
      const res: any = await createFillInBlankQuest(contestId, formData);
      if (res.data.success === true) {
        contestDetail.fillInBlankQuests.push(res.data.data);
        setOpenFill(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateFill = async (selectedQuestion: any, type: string) => {
    try {
      if (type === "fill") {
        const formData = new FormData();
        formData.append("image", file as File);
        formData.append("numberRange", String(selectedQuestion?.numberRange));
        formData.append("question", selectedQuestion?.question);
        formData.append("isImageBase64", imageBase64);
        const res: any = await updateFillInBlankQuest(
          formData,
          selectedQuestion?._id
        );
        if (res.data.success === true) {
          const updatedFillInBlankQuests = [...contestDetail.fillInBlankQuests];
          const index = updatedFillInBlankQuests.findIndex(
            (quest) => quest._id === selectedQuestion._id
          );
          if (index !== -1) {
            updatedFillInBlankQuests[index] = res.data.data;
            setContestDetail({
              ...contestDetail,
              fillInBlankQuests: updatedFillInBlankQuests,
            });
            setDialogOpen(false);
          }
        }
      } else {
        const formData = new FormData();
        formData.append("image", file as File);
        formData.append("question", selectedQuestion?.question);
        formData.append("a", String(selectedQuestion?.a));
        formData.append("b", String(selectedQuestion?.b));
        formData.append("c", String(selectedQuestion?.c));
        formData.append("d", String(selectedQuestion?.d));
        formData.append(
          "correctOption",
          String(selectedQuestion?.correctOption)
        );
        formData.append("isImageBase64", imageBase64);
        const res: any = await updateMCQQuest(formData, selectedQuestion?._id);
        if (res.data.success === true) {
          const updatedMcqQuests = [...contestDetail.mcqQuests];
          const index = updatedMcqQuests.findIndex(
            (quest) => quest._id === selectedQuestion._id
          );
          if (index !== -1) {
            updatedMcqQuests[index] = res.data.data;
            setContestDetail({
              ...contestDetail,
              mcqQuests: updatedMcqQuests,
            });
            setDialogMCQOpen(false);
          }
        }
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

  const handleViewDetails = async (question: any) => {
    try {
      setSelectedQuestion(question);
      setDialogOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewDetailsMCQ = async (question: any) => {
    try {
      setSelectedQuestion(question);
      setDialogMCQOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (fillInBlankQuestId: string) => {
    try {
      const res: any = await deleteFill(contestId, fillInBlankQuestId);
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

  const handleChange = async (event: any) => {
    try {
      const selectedValues = event.target.value;
      setSelectedUser(selectedValues);
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

      <Select multiple value={selectedUser} onChange={handleChange}>
        {allUser.map((user: any) => (
          <MenuItem key={user.value} value={user.value}>
            {user.label}
          </MenuItem>
        ))}
      </Select>
      <br />
      <Button
        variant="contained"
        onClick={() => handleAddUserToContest(selectedUser, contestDetail)}
      >
        Add user to contest
      </Button>
      <br />
      <br />
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
                        alt=""
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
                      onClick={() =>
                        handleViewDetails(question)
                      }
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

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="dialog-title"
      >
        <DialogTitle>Edit Fill</DialogTitle>
        <DialogContent>
          <TextField
            label="Question"
            variant="outlined"
            defaultValue={selectedQuestion?.question}
            onChange={(e) =>
              setSelectedQuestion({
                ...selectedQuestion,
                question: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Number Range"
            variant="outlined"
            type="number"
            defaultValue={selectedQuestion?.numberRange}
            onChange={(e) =>
              setSelectedQuestion({
                ...selectedQuestion,
                numberRange: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          {selectedQuestion?.imageBase64 ? (
            <div style={{ position: "relative" }}>
              <img
                src={`data:image/jpeg;base64,${selectedQuestion?.imageBase64}`}
                alt=""
                style={{ width: "100%" }}
              />
              <IconButton
                onClick={handleImageClose}
                style={{ position: "absolute", top: "8px", right: "8px" }}
              >
                x
              </IconButton>
            </div>
          ) : (
            <input type="file" onChange={handleFileChange} />
          )}
        </DialogContent>
        <DialogActions>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
          <Button
            variant="contained"
            onClick={() => handleUpdateFill(selectedQuestion, "fill")}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

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
                      alt=""
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
                    onClick={() => handleViewDetailsMCQ(question)}
                  >
                    Edit Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={dialogMCQOpen}
        onClose={() => setDialogMCQOpen(false)}
        aria-labelledby="dialog-title"
      >
        <DialogTitle>Edit MCQ</DialogTitle>
        <DialogContent>
          <TextField
            label="Question"
            variant="outlined"
            defaultValue={selectedQuestion?.question}
            onChange={(e) =>
              setSelectedQuestion({
                ...selectedQuestion,
                question: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="A"
            variant="outlined"
            defaultValue={selectedQuestion?.a}
            onChange={(e) =>
              setSelectedQuestion({
                ...selectedQuestion,
                a: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="B"
            variant="outlined"
            defaultValue={selectedQuestion?.b}
            onChange={(e) =>
              setSelectedQuestion({
                ...selectedQuestion,
                b: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="C"
            variant="outlined"
            defaultValue={selectedQuestion?.c}
            onChange={(e) =>
              setSelectedQuestion({
                ...selectedQuestion,
                c: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="D"
            variant="outlined"
            defaultValue={selectedQuestion?.d}
            onChange={(e) =>
              setSelectedQuestion({
                ...selectedQuestion,
                d: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="CorrectOption"
            variant="outlined"
            defaultValue={selectedQuestion?.correctOption}
            onChange={(e) =>
              setSelectedQuestion({
                ...selectedQuestion,
                correctOption: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          {selectedQuestion?.imageBase64 ? (
            <div style={{ position: "relative" }}>
              <img
                src={`data:image/jpeg;base64,${selectedQuestion?.imageBase64}`}
                alt=""
                style={{ width: "100%" }}
              />
              <IconButton
                onClick={handleImageClose}
                style={{ position: "absolute", top: "8px", right: "8px" }}
              >
                x
              </IconButton>
            </div>
          ) : (
            <input type="file" onChange={handleFileChange} />
          )}
        </DialogContent>
        <DialogActions>
          <DialogActions>
            <Button onClick={() => setDialogMCQOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
          <Button
            variant="contained"
            onClick={() => handleUpdateFill(selectedQuestion, "mcq")}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

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
