import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import moment from "moment";

const CATEGORY_URL = "https://workentry-api.herokuapp.com/api/v1/category";
const PROJECT_URL = "https://workentry-api.herokuapp.com/api/v1/project";
const WORKENTRY_URL = "https://workentry-api.herokuapp.com/api/v1/workentry";

export default function CreateWorkentry({ url }) {
    let [categories, setCategories] = useState([]);
    let [projects, setProjects] = useState([]);
    let [selectedProject, setSelectedProject] = useState("");
    let [selectedCategory, setSelectedCategory] = useState("");
    let [optionalText, setOptionalText] = useState("");
    let [startTime, setStartTime] = useState(0);
    let [endTime, setEndTime] = useState(0);
    let [isTracking, setIsTracking] = useState(false);
    let [isDisabled, setIsDisabled] = useState(true);

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
                console.log(`Fetching from ${url}`);
                let [fetched_categories, fetched_projects] = await Promise.all([
                    fetch(CATEGORY_URL),
                    fetch(PROJECT_URL),
                ]);
                fetched_categories = await fetched_categories.json();
                fetched_projects = await fetched_projects.json();
                console.dir(
                    `Successfully fetched, data recieved: ${JSON.stringify(
                        fetched_categories
                    )}`
                );
                console.dir(
                    `Successfully fetched, data recieved: ${JSON.stringify(
                        fetched_projects
                    )}`
                );
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
            <Table
                striped
                bordered
                hover
                variant="dark"
                size="sm"
                style={{ tableLayout: "fixed" }}
            >
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
                            <DropdownButton
                                id="dropdown-basic-button"
                                title={
                                    selectedProject
                                        ? selectedProject
                                        : "Select Project"
                                }
                            >
                                {projects.map((p) => (
                                    <Dropdown.Item
                                        key={p._id}
                                        onSelect={() =>
                                            setSelectedProject(p.project)
                                        }
                                    >
                                        {p.project}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </td>
                        <td>
                            <DropdownButton
                                id="dropdown-basic-button"
                                title={
                                    selectedCategory
                                        ? selectedCategory
                                        : "Select Category"
                                }
                            >
                                {categories.map((c) => (
                                    <Dropdown.Item
                                        key={c._id}
                                        onSelect={() =>
                                            setSelectedCategory(c.category)
                                        }
                                    >
                                        {c.category}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </td>
                        <td>
                            <textarea
                                value={optionalText}
                                style={{ width: "100%" }}
                                onChange={(e) =>
                                    setOptionalText(e.target.value)
                                }
                            ></textarea>
                        </td>
                        <td>
                            <label>
                                {startTime &&
                                    startTime.format("DD.MM.YYYY h:mm:ss")}
                            </label>
                        </td>
                        <td>
                            <label>
                                {endTime &&
                                    endTime.format("DD.MM.YYYY h:mm:ss")}
                            </label>
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
                        let resp = await fetch(WORKENTRY_URL, {
                            method: "post",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                projectName: selectedProject,
                                categoryName: selectedCategory,
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
