import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { PROD_PROJECT_API, DEV_PROJECT_API } from "../../config/api.json";

export default function Project() {
  let [projects, setProjects] = useState([]);
  let [newProject, setNewProject] = useState("");
  let [updateProject, setUpdateProject] = useState("");
  let [updateId, setUpdateId] = useState(null);
  const [projectUrl, setProjectUrl] = useState(process.env.NODE_ENV == "development" ? DEV_PROJECT_API : PROD_PROJECT_API);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      console.log(`Fetching from ${projectUrl}`);
      let [fetched_projects] = await Promise.all([fetch(projectUrl)]);
      fetched_projects = await fetched_projects.json();
      console.dir(`Successfully fetched, data recieved: ${JSON.stringify(fetched_projects)}`);
      await setProjects(fetched_projects.data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <Table striped bordered hover variant="dark" size="sm" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th>id</th>
            <th>Project</th>
            <th>#</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p._id}>
              <td>{p._id.substring(0, 8)}</td>
              <td>{p._id == updateId ? <input onChange={(e) => setUpdateProject(e.target.value)} value={updateProject}></input> : p.project}</td>
              <td>
                {p._id == updateId ? (
                  <>
                    <Button
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
                      e
                    </Button>
                    <Button
                      onClick={async () => {
                        setUpdateId(null);
                      }}
                      variant="warning"
                    >
                      x
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={async () => {
                        setUpdateProject(p.project);
                        setUpdateId(p._id);
                      }}
                      variant="success"
                    >
                      e
                    </Button>
                    <Button
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
                      X
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td>-</td>
            <td>
              <input value={newProject} onChange={(e) => setNewProject(e.target.value)}></input>
            </td>
            <td>
              <Button
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
                Add
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}
