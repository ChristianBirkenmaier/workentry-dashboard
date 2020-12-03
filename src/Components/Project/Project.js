import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { PROD_PROJECT_API, DEV_PROJECT_API } from "../../config/api.json";
import sortList from "../../helpers";
import { BsFillTrashFill, BsGear, BsFillBookmarkFill, BsFillXCircleFill } from "react-icons/bs";

export default function Project({ isDev }) {
    let [projects, setProjects] = useState([]);
    let [newProject, setNewProject] = useState("");
    let [updateProject, setUpdateProject] = useState("");
    let [updateId, setUpdateId] = useState(null);
    const [projectUrl, setProjectUrl] = useState(isDev ? DEV_PROJECT_API : PROD_PROJECT_API);
    let [sort, setSort] = useState({ name: "project", asc: false });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        console.log("useEffect sort");
        setProjects(sortList(sort, projects));
    }, [sort]);

    useEffect(() => {
        console.log("isDev: ", isDev);
        setProjectUrl(isDev ? DEV_PROJECT_API : PROD_PROJECT_API);
    }, [isDev]);

    useEffect(() => {
        fetchData();
    }, [projectUrl]);

    async function fetchData() {
        try {
            console.log(`Fetching from ${projectUrl}`);
            let [fetched_projects] = await Promise.all([fetch(projectUrl)]);
            fetched_projects = await fetched_projects.json();
            console.dir(`Successfully fetched, data recieved: ${JSON.stringify(fetched_projects)}`);
            setProjects(sortList(sort, fetched_projects.data));
        } catch (err) {
            console.error(err);
            setProjects([]);
        }
    }

    return (
        <Container className="data-container">
            <Row className="data-header align-items-center">
                <Col
                    sm={10}
                    onClick={() => {
                        setSort({ name: "project", asc: sort.asc ? !sort.asc : true });
                    }}
                >
                    Projektname {sort.name === "project" ? sort.asc ? <span>▲</span> : <span>▼</span> : <span>▵</span>}
                </Col>
                <Col sm={2}></Col>
            </Row>
            {projects.map((p) => (
                <Row key={p._id} className="align-items-center">
                    <Col sm={10}>
                        {p._id === updateId ? <input onChange={(e) => setUpdateProject(e.target.value)} value={updateProject}></input> : p.project}
                    </Col>
                    <Col sm={2}>
                        {p._id === updateId ? (
                            <Button
                                size="sm"
                                onClick={async () => {
                                    let resp = await fetch(`${projectUrl}/${p._id}`, {
                                        method: "put",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            id: p._id,
                                            project: updateProject,
                                        }),
                                    });
                                    console.log(resp);
                                    resp = await resp.text();
                                    console.log("Updated successfully", resp);
                                    fetchData();
                                    setUpdateId(null);
                                }}
                                variant="primary"
                            >
                                <BsFillBookmarkFill />
                            </Button>
                        ) : (
                            <>
                                <Button
                                    size="sm"
                                    onClick={async () => {
                                        setUpdateProject(p.project);
                                        setUpdateId(p._id);
                                    }}
                                    variant="dark"
                                >
                                    <BsGear />
                                </Button>
                            </>
                        )}
                        {p._id === updateId ? (
                            <Button
                                size="sm"
                                onClick={async () => {
                                    setUpdateId(null);
                                }}
                                variant="warning"
                            >
                                <BsFillXCircleFill />
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                onClick={async () => {
                                    let resp = await fetch(`${projectUrl}/${p._id}`, {
                                        method: "delete",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            id: p._id,
                                        }),
                                    });
                                    console.log(resp);
                                    resp = await resp.text();
                                    console.log("Deleted successfully", resp);
                                    fetchData();
                                }}
                                variant="danger"
                            >
                                <BsFillTrashFill />
                            </Button>
                        )}
                    </Col>
                </Row>
            ))}
            <Row className="align-items-center">
                <Col sm={4} style={{ fontWeight: "bold" }}>
                    Neues Projekt
                </Col>
                <Col sm={6}>
                    <input value={newProject} onChange={(e) => setNewProject(e.target.value)}></input>
                </Col>

                <Col sm={2}>
                    <Button
                        size="sm"
                        onClick={async () => {
                            console.log(newProject);

                            let resp = await fetch(projectUrl, {
                                method: "post",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    project: newProject,
                                }),
                            });
                            console.log(resp);
                            resp = await resp.text();
                            console.log("Posted successfully", resp);

                            // posting
                            setNewProject("");
                            fetchData();
                        }}
                        variant="primary"
                    >
                        <BsFillBookmarkFill />
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}
