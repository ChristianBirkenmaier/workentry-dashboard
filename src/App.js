import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav } from "react-bootstrap";
import { Workentry, CreateWorkentry } from "./Components/Workentry";
import { Category } from "./Components/Category";
import { Project } from "./Components/Project";

const WorkentriesComp = <Workentry url="https://workentry-api.herokuapp.com/api/v1/workentry" />;
const CreateWorkentryComp = <CreateWorkentry />;
const CategoryComp = <Category />;
const ProjectComp = <Project />;

function App() {
  let [activeComponent, setActiveComponent] = useState(WorkentriesComp);
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" style={{ top: 0 }}>
        <Nav>
          <Nav.Link onClick={() => setActiveComponent(CategoryComp)}>Categories</Nav.Link>
          <Nav.Link onClick={() => setActiveComponent(ProjectComp)}>Projects</Nav.Link>
          <Nav.Link onClick={() => setActiveComponent(WorkentriesComp)}>Workentries</Nav.Link>
          <Nav.Link onClick={() => setActiveComponent(CreateWorkentryComp)}>New Workentry</Nav.Link>
        </Nav>
      </Navbar>
      <header className="App-header">{activeComponent}</header>
    </div>
  );
}

export default App;
