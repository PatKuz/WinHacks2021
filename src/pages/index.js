import React, { Component } from "react";
import styled from "styled-components";
import { navigate } from "gatsby";

import { withFirebase } from "../api/";
import { Centered } from "../styles/global";
import Card from "../components/Card";
import Logo from "../components/Logo";
import SEO from "../components/SEO";
import Room from "../components/Room";

import Background from "../images/pattern_3.svg";

const StyledCentered = styled(Centered)`
  background: url(${Background});
`;

class IndexPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roomCode: "",
      rooms: null,
      errorMsg: "",
    };

    this._initFirebase = false;
    this.unsubRooms = null;
  }

  componentDidMount() {
    if (this.props.firebase && !this._initFirebase) this.loadData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.firebase && !this._initFirebase) this.loadData();
  }

  componentWillUnmount() {
    if (typeof this.unsubRooms === "function") this.unsubRooms();
  }

  loadData = async () => {
    this._initFirebase = true;

    let storedRoomCode = localStorage.getItem("roomCode");

    if (storedRoomCode !== null && storedRoomCode !== undefined)
      this.setState({ roomCode: storedRoomCode });

    // eslint-disable-next-line
    const rooms = await new Promise((resolve, reject) => {
      let resolveOnce = (doc) => {
        resolveOnce = () => null;
        resolve(doc);
      };

      this.unsubRooms = this.props.firebase
        .rooms()
        .onSnapshot((querySnapshot) => {
          const rooms = querySnapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          });
          this.setState({ rooms });
          resolveOnce(rooms);
        }, reject);
    });
  };

  addStudent = (studentID, roomID) => {
    const { rooms } = this.state;
    const room = rooms.find((r) => r.id === roomID);

    room.students[studentID] = false;

    this.props.firebase
      .room(roomID)
      .set(room)
      .catch((err) => {
        console.log(err);
      });
  };

  toggleConfused = (studentID, roomID) => {
    const { rooms } = this.state;
    const room = rooms.find((r) => r.id === roomID);
    console.log(room.students[studentID]);
    room.students[studentID] = !room.students[studentID];

    this.props.firebase
      .room(roomID)
      .set(room)
      .catch((err) => {
        console.log(err);
      });
  };

  setRoomCode = (roomCode) => {
    this.setErrorMsg("");

    localStorage.setItem("roomCode", roomCode);

    this.setState({ roomCode: roomCode });
  };

  setErrorMsg = (errorMsg) => {
    this.setState({ errorMsg: errorMsg });
    this.forceUpdate();
  };

  attemptLogin = (email, password) => {
    this.setErrorMsg("");
    this.props.firebase
      .doSignInWithEmail(email, password)
      .then(() => {
        navigate("/control-panel");
        this.setErrorMsg("Registration request received!");
      })
      .catch((err) => {
        console.log(err);
        this.setErrorMsg("Login Failed!");
      });
  };

  attemptRegister = (name, email, password, institution) => {
    this.setErrorMsg("");
    this.props.firebase
      .doRegisterWithEmail(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        this.props.firebase
          .user(user.uid)
          .set({
            name: name,
            email: email,
            roles: { requested: true },
            institution: institution,
            pastSessions: {},
          })
          .catch((err) => {
            console.log(err);
            this.setErrorMsg("User Creation Failed!");
          });
      });
  };

  addQuestion = async (roomID, questionID, question, studentID) => {
    const { rooms } = this.state;

    const room = rooms.find((r) => r.id === roomID);

    room.questions[questionID] = question;

    this.props.firebase
      .room(roomID)
      .set(room)
      .catch((err) => {
        console.log(err);
      });
  };

  updateRoom = (room) => {
    const id = room.id;
    delete room.id;
    this.props.firebase
      .room(id)
      .set(room)
      .catch((err) => {
        console.log(err);
      });
  };

  exitRoom = (studentID, roomID) => {
    this.setRoomCode("");
    const { rooms } = this.state;

    const room = rooms.find((r) => r.id === roomID);
    delete room.students[studentID];

    this.props.firebase
      .room(roomID)
      .set(room)
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    let { rooms, roomCode, errorMsg } = this.state;

    const room = rooms ? rooms.find((r) => r.id === roomCode) : null;

    if (errorMsg !== "")
      return (
        <>
          <SEO title="Home" route="/" />
          <StyledCentered>
            <Logo size="large" />
            <h1> {errorMsg} </h1>
            <Card
              setRoomCode={this.setRoomCode}
              attemptLogin={this.attemptLogin}
              attemptRegister={this.attemptRegister}
            />
          </StyledCentered>
        </>
      );
    else if (roomCode === "")
      return (
        <>
          <SEO title="Home" route="/" />
          <StyledCentered>
            <Logo size="large" />
            <Card
              setRoomCode={this.setRoomCode}
              attemptLogin={this.attemptLogin}
              attemptRegister={this.attemptRegister}
            />
          </StyledCentered>
        </>
      );
    else if (room === null || room === undefined) {
      localStorage.setItem("roomCode", "");
      return (
        <>
          <SEO title="Home" route="/" />
          <StyledCentered>
            <Logo size="large" />
            <h1> Room not found! </h1>
            <Card
              setRoomCode={this.setRoomCode}
              attemptLogin={this.attemptLogin}
              attemptRegister={this.attemptRegister}
            />
          </StyledCentered>
        </>
      );
    } else
      return (
        <>
          <SEO title="Room" route="/" />
          <Room
            room={room}
            addQuestion={this.addQuestion}
            exitRoom={this.exitRoom}
            updateRoom={this.updateRoom}
            addStudent={this.addStudent}
            toggleConfused={this.toggleConfused}
          />
        </>
      );
  }
}

export default withFirebase(IndexPage);
