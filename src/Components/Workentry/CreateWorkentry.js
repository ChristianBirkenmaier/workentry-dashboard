import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import moment from "moment";

import { PROD_WORKENTRY_API, PROD_CATEGORY_API, PROD_PROJECT_API, DEV_WORKENTRY_API, DEV_CATEGORY_API, DEV_PROJECT_API } from "../../config/api.json";

export default function CreateWorkentry() {
  let [categories, setCategories] = useState([]);
  let [projects, setProjects] = useState([]);
  let [selectedProject, setSelectedProject] = useState("");
  let [selectedCategory, setSelectedCategory] = useState("");
  let [optionalText, setOptionalText] = useState("");
  let [startTime, setStartTime] = useState(0);
  let [endTime, setEndTime] = useState(0);
  let [isTracking, setIsTracking] = useState(false);
  let [isDisabled, setIsDisabled] = useState(true);
  const [workentryUrl, setWorkentryUrl] = useState(process.env.NODE_ENV == "development" ? DEV_WORKENTRY_API : PROD_WORKENTRY_API);
  const [categoryUrl, setCategoryUrl] = useState(process.env.NODE_ENV == "development" ? DEV_CATEGORY_API : PROD_CATEGORY_API);
  const [projectUrl, setProjectUrl] = useState(process.env.NODE_ENV == "development" ? DEV_PROJECT_API : PROD_PROJECT_API);

  function setDefault() {
    setSelectedCategory("");
    setSelectedProject("");
    setOptionalText("");
    setStartTime(0);
    setEndTime(0);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        let [fetched_categories, fetched_projects] = await Promise.all([fetch(categoryUrl), fetch(projectUrl)]);
        fetched_categories = await fetched_categories.json();
        fetched_projects = await fetched_projects.json();
        console.dir(`Successfully fetched, data recieved: ${fetched_categories}`);
        console.dir(`Successfully fetched, data recieved: ${fetched_projects}`);
        await setCategories(fetched_categories.data);
        await setProjects(fetched_projects.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (startTime && endTime && selectedCategory && selectedProject) {
      return setIsDisabled(false);
    }
  }, [selectedCategory, selectedProject, startTime, endTime]);

  return (
    <>
      <Table striped bordered hover variant="dark" size="sm" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th>Project</th>
            <th>Category</th>
            <th>Optional</th>
            <th>Start</th>
            <th>End</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <DropdownButton id="dropdown-basic-button" title={selectedProject ? selectedProject.name : "Select Project"}>
                {projects.map((p) => (
                  <Dropdown.Item key={p._id} onSelect={() => setSelectedProject({ _id: p._id, name: p.project })}>
                    {p.project}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </td>
            <td>
              <DropdownButton id="dropdown-basic-button" title={selectedCategory ? selectedCategory.name : "Select Category"}>
                {categories.map((c) => (
                  <Dropdown.Item key={c._id} onSelect={() => setSelectedCategory({ _id: c._id, name: c.category })}>
                    {c.category}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </td>
            <td>
              <textarea value={optionalText} style={{ width: "100%" }} onChange={(e) => setOptionalText(e.target.value)}></textarea>
            </td>
            <td>
              <label>{startTime && startTime.format("DD.MM.YYYY h:mm:ss")}</label>
            </td>
            <td>
              <label>{endTime && endTime.format("DD.MM.YYYY h:mm:ss")}</label>
            </td>
          </tr>
        </tbody>
      </Table>
      <div>
        <Button
          onClick={() => {
            if (isTracking) {
              setIsTracking(false);
              setEndTime(moment());
            } else {
              setIsTracking(true);
              setStartTime(moment());
            }
          }}
        >
          {startTime ? "End Tracking" : "Start Tracking"}
        </Button>
        {isTracking && (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}
        <Button
          variant="danger"
          disabled={isDisabled}
          onClick={async () => {
            let resp = await fetch(workentryUrl, {
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                project: selectedProject._id,
                category: selectedCategory._id,
                fromDate: startTime.valueOf(),
                untilDate: endTime.valueOf(),
                optionalText: optionalText,
              }),
            });
            console.log(resp);
            resp = await resp.text();
            console.log("Posted successfully", resp);
          }}
        >
          Zeiteintrag abschicken
        </Button>
        <Button variant="success" onClick={() => setDefault()}>
          Reset
        </Button>
      </div>
    </>
  );
}
