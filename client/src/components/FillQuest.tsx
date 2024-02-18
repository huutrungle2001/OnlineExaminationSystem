import { useState } from "react";
import { Card, CardContent, Typography, TextField } from "@mui/material";

const FillQuestion = (props: any) => {
  const [userAnswer, setUserAnswer] = useState("");

  const handleInputChange = (event: any) => {
    setUserAnswer(event.target.value);
    props.onAnswer(props.id, event.target.value);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          {props.title}
        </Typography>
        {props.image && (
          <img
            src={`data:image/jpeg;base64,${props.image}`}
            alt=""
            style={{ marginBottom: "10px" }}
          />
        )}
        <TextField
          id="userAnswer"
          value={userAnswer}
          onChange={handleInputChange}
          variant="outlined"
          size="small"
          placeholder="Type your answer here..."
          fullWidth
        />
      </CardContent>
    </Card>
  );
};

export default FillQuestion;