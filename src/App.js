import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Dropdown, Form } from "react-bootstrap";
import { Workentry } from "./Components/Workentry";
import { Category } from "./Components/Category";
import { Project } from "./Components/Project";

function App() {
    let [activeComponent, setActiveComponent] = useState("workentries");
    // let [isDev, setIsDev] = useState(process.env.NODE_ENV === "development");
    let [isDev, setIsDev] = useState(false);

    // const WorkentriesComp = <Workentry isDev={isDev} />;
    // const CreateWorkentryComp = <CreateWorkentry />;
    // const CategoryComp = <Category isDev={isDev} />;
    // const ProjectComp = <Project isDev={isDev} />;
    return (
        <div className="App">
            <Navbar>
                <Nav className="mr-auto">
                    <Nav.Link onClick={() => setActiveComponent("projects")}>Projekte</Nav.Link>
                    <Nav.Link onClick={() => setActiveComponent("categories")}>Kategorien</Nav.Link>
                    <Nav.Link onClick={() => setActiveComponent("workentries")}>Zeiteinträge</Nav.Link>
                </Nav>
                <Form inline>
                    <Dropdown>
                        <Dropdown.Toggle variant="warning" className="" block>
                            {isDev ? "Dev" : "Prod"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                onClick={() => {
                                    console.log("Setting connection to dev");
                                    setIsDev(true);
                                }}
                            >
                                Dev
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => {
                                    console.log("Setting connection to prod");
                                    setIsDev(false);
                                }}
                            >
                                Prod
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Form>
            </Navbar>
            <div style={activeComponent !== "workentries" ? { display: "none" } : {}}>
                <Workentry isDev={isDev} />
            </div>
            <div style={activeComponent !== "categories" ? { display: "none" } : {}}>
                <Category isDev={isDev} />
            </div>
            <div style={activeComponent !== "projects" ? { display: "none" } : {}}>
                <Project isDev={isDev} />
            </div>
        </div>
    );
}

export default App;
