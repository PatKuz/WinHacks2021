import * as React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import Background from "../images/pattern_3.svg";
import { Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import ReactChipInput from "react-chip-input";

const StyledFormGroup = styled(Form.Group)`
  background-color: #ffffff;
  border-radius: 2px;
  font-family: "Overpass", sans-serif;
  font-size: 20px;
  color: #242424;
  display: inline-block;
`;

const StyledFormControl = styled(Form.Control)`
  background-color: #ffffff;
  position: relative;
  text-decoration: none;
  border: 2px solid #5458ec;
  border-radius: 8px;
  width: 400px;
  height: 40px;
  margin-left: 20px;
  font-family: "Overpass", sans-serif;
  font-size: 20px;
  display: inline-block;
`;

const StyledFormControlBody = styled(Form.Control)`
  background-color: #ffffff;
  position: relative;
  text-decoration: none;
  border: 2px solid #5458ec;
  border-radius: 8px;
  width: 400px;
  height: 100px;
  margin-left: 20px;
  font-family: "Overpass", sans-serif;
  font-size: 16px;
  display: inline-block;
`;

const StyledDiv = styled.div`
  background-color: #ffffff;
  border-left: 3px solid #292929;
  border-right: 3px solid #292929;
  width: 50%;
  height: 100%;
  position: absolute;
  justify-content: center;
  align-items: center;
  overflow: scroll;
`;

const StyledDivTwo = styled.div`
  font-family: "Overpass", sans-serif;
  font-size: 20px;
  color: #242424;
  background-color: #e2e2e2;
  display: inline-block;
  padding: 10px 10px;
  width: 96%;
  border-radius: 10px;
  margin-top: 8px;
  text-align: left;
  height: 140px;
  border: 2px solid #242424;
  left: 0;
  right: 0;
  margin-left: 2%;
`;

const BackgroundDiv = styled.div`
  background: url(${Background});
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const StyledButton = styled(Button)`
  background-color: #ff6961;
  display: inline-block;
  margin-left: 90%;
  margin-top: -46%;
  border-radius: 6px;
  text-decoration: none;
  position: fixed;
  border: 2px solid #ffffff;
  padding: 10px 20px;
  font-size: 15px;
  &:hover {
    background-color: #ffffff !important;
    color: #ff6961;
    border: 2px solid #ff6961;
  }
`;

const StyledLeave = styled(Button)`
  background-color: #ff6961;
  display: inline-block;
  margin-left: -90%;
  margin-top: -46%;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 15px;
  text-decoration: none;
  border: 2px solid #ffffff;
  position: fixed;
  &:hover {
    background-color: #ffffff !important;
    color: #ff6961;
    border: 2px solid #ff6961;
  }
`;

const StyledQuestion = styled.div`
  font-size: 15px;
`;

const StyledParentVote = styled.div`
  margin-right: 3px;
`;

const StyledVote = styled(Button)`
  color: #242424;
  background-color: ${(props) => props.color};
  transition-duration: 0.2s;
  margin-left: 90%;
  cursor: pointer;
  text-decoration: none;
  border-radius: 18px;
  border: 2px solid #242424;
  padding: 2px 8px;
  margin-bottom: 10px;
  &:hover {
    background-color: ${(props) => props.hovercolor};
    color: #ffffff;
  }
`;

const StyledConfused = styled(Button)`
  color: #242424;
  background-color: ${(props) => props.color};
  transition-duration: 0.2s;
  margin-right: -85%;
  margin-top: 40%;
  cursor: pointer;
  text-decoration: none;
  border-radius: 18px;
  border: 2px solid #242424;
  padding: 50px 50px;
  font-size: 24px;
  &:hover {
    background-color: ${(props) => props.hovercolor};
    color: #ffffff;
  }
`;

class Room extends React.Component {
  constructor() {
    super();
    this.state = {
      studentID: "",
      showHide: false,
      questionTitle: "",
      questionBody: "",
      chips: [],
      errorMsg: "",
    };
  }

  componentDidMount() {
    const { studentID } = this.state;

    let storedStudentID = localStorage.getItem("studentID");
    if (storedStudentID !== null && storedStudentID !== undefined) {
      this.setState({ studentID: storedStudentID });
      this.props.addStudent(storedStudentID, this.props.room.id);
    } else if (studentID === "") {
      const uid = uuidv4();
      this.setState({ studentID: uid });
      localStorage.setItem("studentID", uid);
      this.props.addStudent(uid, this.props.room.id);
    }
  }

  handleModalShowHide() {
    this.setState({
      showHide: !this.state.showHide,
      questionTitle: "",
      questionBody: "",
      chips: [],
    });
  }

  addChip = (value) => {
    const chips = this.state.chips.slice();
    chips.push(value);
    this.setState({ chips });
  };
  removeChip = (index) => {
    const chips = this.state.chips.slice();
    chips.splice(index, 1);
    this.setState({ chips });
  };

  submitQuestion = () => {
    const { questionTitle, questionBody, chips, studentID } = this.state;
    this.setState({ errorMsg: "" });

    if (questionTitle !== "" && questionBody !== "") {
      this.handleModalShowHide();
      this.props.addQuestion(
        this.props.room.id,
        uuidv4(),
        {
          title: questionTitle,
          description: questionBody,
          tags: chips,
          upvotes: {},
        },
        studentID
      );
    } else {
      this.setState({ errorMsg: "Questions need a title and description!" });
    }
  };

  dealWithUpvote = (question, questionID) => {
    const { studentID } = this.state;
    const room = this.props.room;

    if (question.upvotes.hasOwnProperty(studentID)) {
      console.log(room.questions[questionID].upvotes);
      delete room.questions[questionID].upvotes[studentID];
    } else {
      room.questions[questionID].upvotes[studentID] = true;
    }

    this.props.updateRoom(room);
  };

  render() {
    const {
      showHide,
      questionTitle,
      questionBody,
      chips,
      errorMsg,
      studentID,
    } = this.state;

    const OrderedList = Object.entries(this.props.room.questions).sort(
      (a, b) => {
        let amountOne = 0;
        Object.keys(a[1].upvotes).map((key) => amountOne++);
        let amountTwo = 0;
        Object.keys(b[1].upvotes).map((key) => amountTwo++);

        return amountTwo > amountOne ? 1 : -1;
      }
    );

    const Questions = () =>
      OrderedList.map((val) => {
        const question = val[1];

        let amount = 0;
        Object.keys(question.upvotes).map((key) => amount++);

        return (
          <StyledDivTwo key={val[0]} amount={amount}>
            <div> {question.title} </div>
            <hr />
            <StyledQuestion>
              {" "}
              {question.description}{" "}
              <StyledParentVote>
                <StyledVote
                  color={
                    question.upvotes.hasOwnProperty(studentID)
                      ? "#22bc22"
                      : "#ffffff"
                  }
                  hovercolor={
                    question.upvotes.hasOwnProperty(studentID)
                      ? "#ff6961"
                      : "#22bc22"
                  }
                  onClick={() => this.dealWithUpvote(question, val[0])}
                >
                  {amount} Votes
                </StyledVote>
              </StyledParentVote>
            </StyledQuestion>
          </StyledDivTwo>
        );
      });

    return (
      <BackgroundDiv>
        <StyledLeave
          onClick={() => this.props.exitRoom(studentID, this.props.room.id)}
        >
          Leave Room
        </StyledLeave>
        <StyledConfused
          color={this.props.room.students[studentID] ? "#ff6961" : "#ffffff"}
          hoverColor={
            this.props.room.students[studentID] ? "#22bc22" : "#ff6961"
          }
          onClick={() =>
            this.props.toggleConfused(studentID, this.props.room.id)
          }
        >
          I'm Confused
        </StyledConfused>
        <StyledDiv>
          <Questions />
        </StyledDiv>
        <StyledButton onClick={() => this.handleModalShowHide()}>
          Ask Question
        </StyledButton>
        <Modal
          show={showHide}
          onHide={() => this.handleModalShowHide()}
          centered
        >
          <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
            <Modal.Title>Enter Question</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5> {errorMsg} </h5>
            <Form>
              <StyledFormGroup controlId="question">
                <StyledFormControl
                  as="textarea"
                  placeholder="Question Title"
                  value={questionTitle}
                  onChange={(e) =>
                    this.setState({ questionTitle: e.target.value })
                  }
                />
              </StyledFormGroup>
              <StyledFormGroup controlId="question">
                <StyledFormControlBody
                  as="textarea"
                  placeholder="Question Body"
                  value={questionBody}
                  onChange={(e) =>
                    this.setState({ questionBody: e.target.value })
                  }
                />
              </StyledFormGroup>
            </Form>
            <ReactChipInput
              classes="class1 class2"
              chips={chips}
              onSubmit={(value) => this.addChip(value)}
              onRemove={(index) => this.removeChip(index)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.handleModalShowHide()}
            >
              Close
            </Button>
            <Button onClick={() => this.submitQuestion()}>Post Question</Button>
          </Modal.Footer>
        </Modal>
      </BackgroundDiv>
    );
  }
}

export default Room;
