import * as React from "react"

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Centered } from "../styles/global";

class Login extends React.Component {
	state = {
		email: "",
		password: "",
	}
	
	
	render() {
	  const {email, password} = this.state;
	  return (
		<Centered>
			<h1> Teacher </h1>
            <Form>
              <Form.Group controlId="email">
			  <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) =>
                    this.setState({ email: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="password">
			  <Form.Label>Password</Form.Label>
                <Form.Control
                  type="text"
                  value={password}
                  onChange={(e) =>
                    this.setState({ password: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
			
            <Button
              variant="primary"
              onClick={() =>
                this.props.attemptLogin(email, password)
              }
            >
              Login
            </Button>
			<Button
              variant="primary"
              onClick={() =>
                this.props.setRender("register")
              }
            >
              Register
            </Button>
		</Centered>
	  );
	}
};

export default Login;