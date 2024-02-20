import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { useParams } from "react-router-dom";
import { getTestDetail, submit } from "../../../api/api";
import FillQuestion from "../../../components/FillQuest";
import MCQuestion from "../../../components/MCQuest";
import { Typography, Box, Button } from "@mui/material";
import { useAppSelector } from "../../../store";

const TestDetail = () => {
  const [contestDetail, setContestDetail] = useState<any>();
  const { contestId } = useParams();
  const {
    auth: { userDetails },
  } = useAppSelector((state) => state);
  const [userAnswers, setUserAnswers] = useState<any>({
    userId: userDetails?._id,
    contestId: contestId,
    answers: [],
  });

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response: any = await getTestDetail(contestId);
        if (response.data.success === true) {
          setContestDetail(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchContests();
  }, [contestId]);

  const handleFillAnswer = (questionId: string, answer: string) => {
    const updateAnswer = (
      answers: any[],
      questionId: string,
      answer: string
    ) => {
      const answerIndex = answers.findIndex(
        (item) => item.idQuestion === questionId
      );
      if (answerIndex !== -1) {
        answers[answerIndex].answer = answer;
      } else {
        answers.push({
          idQuestion: questionId,
          type: "fill",
          answer: answer,
        });
      }
      return answers;
    };

    setUserAnswers((prevAnswers: any) => ({
      ...prevAnswers,
      answers: updateAnswer([...prevAnswers.answers], questionId, answer),
    }));
  };

  const handleSubmit = async () => {
    try {
      const response: any = await submit(userAnswers);
      if (response.data.success === true) {
        alert(`Your test score: ${response.data.data.testScores}`);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMCAnswer = (questionId: string, answer: string) => {
    const updateAnswer = (
      answers: any[],
      questionId: string,
      answer: string
    ) => {
      const answerIndex = answers.findIndex(
        (item) => item.idQuestion === questionId
      );
      if (answerIndex !== -1) {
        answers[answerIndex].answer = answer;
      } else {
        answers.push({
          idQuestion: questionId,
          type: "mc",
          answer: answer,
        });
      }
      return answers;
    };

    setUserAnswers((prevAnswers: any) => ({
      ...prevAnswers,
      answers: updateAnswer([...prevAnswers.answers], questionId, answer),
    }));
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Contest Details
      </Typography>
      <Box marginBottom={2}>
        <Typography variant="subtitle1" gutterBottom>
          Title: {contestDetail?.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Description: {contestDetail?.description}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Host ID: {contestDetail?.hostId}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Created At: {contestDetail?.createdAt}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Updated At: {contestDetail?.updatedAt}
        </Typography>
      </Box>

      <Typography variant="h5" gutterBottom>
        Fill in Blank Questions:
      </Typography>
      <Box marginBottom={2}>
        {contestDetail?.fillInBlankQuests.map(
          (question: any, index: number) => (
            <FillQuestion
              key={question._id}
              id={question._id}
              title={question.question}
              image={question.imageBase64}
              onAnswer={handleFillAnswer}
            />
          )
        )}
      </Box>

      <Typography variant="h5" gutterBottom>
        Multiple Choice Questions:
      </Typography>
      <Box marginBottom={2}>
        {contestDetail?.mcqQuests.map((question: any, index: number) => (
          <MCQuestion
            key={question._id}
            id={question._id}
            title={question.question}
            image={question.imageBase64}
            options={[question.a, question.b, question.c, question.d]}
            onAnswer={handleMCAnswer}
          />
        ))}
      </Box>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Layout>
  );
};

export default TestDetail;
