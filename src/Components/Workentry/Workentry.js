import React, { useState, useEffect } from "react";
import { PROD_WORKENTRY_API, DEV_WORKENTRY_API, PROD_PROJECT_API, DEV_PROJECT_API, PROD_CATEGORY_API, DEV_CATEGORY_API } from "../../config/api.json";
import { Col, Container, Row, Button, FormControl, InputGroup, Dropdown, ButtonGroup } from "react-bootstrap";
import sortList from "../../helpers";
import { BsFillTrashFill, BsGear, BsFillBookmarkFill, BsFillXCircleFill } from "react-icons/bs";

const sortAlphaDownIcon = () => (
    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-sort-alpha-down" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M4 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11A.5.5 0 0 1 4 2z" />
        <path fillRule="evenodd" d="M6.354 11.146a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L4 12.793l1.646-1.647a.5.5 0 0 1 .708 0z" />
        <path d="M9.664 7l.418-1.371h1.781L12.281 7h1.121l-1.78-5.332h-1.235L8.597 7h1.067zM11 2.687l.652 2.157h-1.351l.652-2.157H11zM9.027 14h3.934v-.867h-2.645v-.055l2.567-3.719v-.691H9.098v.867h2.507v.055l-2.578 3.719V14z" />
    </svg>
);

const sortAlphaUpIcon = () => (
    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-sort-alpha-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M4 14a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-1 0v11a.5.5 0 0 0 .5.5z" />
        <path fillRule="evenodd" d="M6.354 4.854a.5.5 0 0 0 0-.708l-2-2a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L4 3.207l1.646 1.647a.5.5 0 0 0 .708 0z" />
        <path d="M9.664 7l.418-1.371h1.781L12.281 7h1.121l-1.78-5.332h-1.235L8.597 7h1.067zM11 2.687l.652 2.157h-1.351l.652-2.157H11zM9.027 14h3.934v-.867h-2.645v-.055l2.567-3.719v-.691H9.098v.867h2.507v.055l-2.578 3.719V14z" />
    </svg>
);

const sortNumericDownIcon = () => (
    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-sort-numeric-down" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M4 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11A.5.5 0 0 1 4 2z" />
        <path fillRule="evenodd" d="M6.354 11.146a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L4 12.793l1.646-1.647a.5.5 0 0 1 .708 0z" />
        <path d="M12.438 7V1.668H11.39l-1.262.906v.969l1.21-.86h.052V7h1.046zm-2.84 5.82c.054.621.625 1.278 1.761 1.278 1.422 0 2.145-.98 2.145-2.848 0-2.05-.973-2.688-2.063-2.688-1.125 0-1.972.688-1.972 1.836 0 1.145.808 1.758 1.719 1.758.69 0 1.113-.351 1.261-.742h.059c.031 1.027-.309 1.856-1.133 1.856-.43 0-.715-.227-.773-.45H9.598zm2.757-2.43c0 .637-.43.973-.933.973-.516 0-.934-.34-.934-.98 0-.625.407-1 .926-1 .543 0 .941.375.941 1.008z" />
    </svg>
);

const sortNumericUpIcon = () => (
    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-sort-numeric-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M4 14a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-1 0v11a.5.5 0 0 0 .5.5z" />
        <path fillRule="evenodd" d="M6.354 4.854a.5.5 0 0 0 0-.708l-2-2a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L4 3.207l1.646 1.647a.5.5 0 0 0 .708 0z" />
        <path d="M12.438 7V1.668H11.39l-1.262.906v.969l1.21-.86h.052V7h1.046zm-2.84 5.82c.054.621.625 1.278 1.761 1.278 1.422 0 2.145-.98 2.145-2.848 0-2.05-.973-2.688-2.063-2.688-1.125 0-1.972.688-1.972 1.836 0 1.145.808 1.758 1.719 1.758.69 0 1.113-.351 1.261-.742h.059c.031 1.027-.309 1.856-1.133 1.856-.43 0-.715-.227-.773-.45H9.598zm2.757-2.43c0 .637-.43.973-.933.973-.516 0-.934-.34-.934-.98 0-.625.407-1 .926-1 .543 0 .941.375.941 1.008z" />
    </svg>
);

const filterIcon = () => (
    // <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-filter-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    //     <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
    //     <path
    //         fillRule="evenodd"
    //         d="M7 11.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"
    //     />
    // </svg>
    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-filter" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
        />
    </svg>
);

export default function Workentry({ isDev }) {
    let [workentries, setWorkentries] = useState([]);
    let [filteredWorkentries, setFilteredWorkentries] = useState([]);
    const [workentryUrl, setWorkentryUrl] = useState(isDev ? DEV_WORKENTRY_API : PROD_WORKENTRY_API);
    const [categoryUrl, setCategoryUrl] = useState(isDev ? DEV_CATEGORY_API : PROD_CATEGORY_API);
    const [projectUrl, setProjectUrl] = useState(isDev ? DEV_PROJECT_API : PROD_PROJECT_API);
    let [categories, setCategories] = useState([]);
    let [projects, setProjects] = useState([]);
    let [filter, setFilter] = useState({ filterRubric: null, filterText: null });
    let [updateData, setUpdateData] = useState(null);

    let [sort, setSort] = useState({ name: "category.category", asc: false });

    async function fetchData() {
        try {
            console.log(`Fetching from ${workentryUrl}`);
            // let workentries = await fetch(workentryUrl);
            let [fetched_projects, workentries, fetched_categories] = await Promise.all([fetch(projectUrl), fetch(workentryUrl), fetch(categoryUrl)]);
            workentries = await workentries.json();
            fetched_categories = await fetched_categories.json();
            // console.dir(`Successfully fetched, data recieved: ${JSON.stringify(workentries)}`);
            fetched_projects = await fetched_projects.json();
            // console.dir(`Successfully fetched, data recieved: ${JSON.stringify(fetched_projects)}`);
            setCategories(sortList({ name: "category", asc: true }, fetched_categories.data));
            setProjects(sortList({ name: "project", asc: true }, fetched_projects.data));
            setWorkentries(sortList(sort, workentries.data));
        } catch (err) {
            console.error(err);
            setWorkentries([]);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        setFilteredWorkentries(workentries);
    }, [workentries]);

    useEffect(() => {
        console.log("useEffect sort");
        setFilteredWorkentries(sortList(sort, workentries));
    }, [sort]);

    useEffect(() => {
        setWorkentryUrl(isDev ? DEV_WORKENTRY_API : PROD_WORKENTRY_API);
    }, [isDev]);

    useEffect(() => {
        fetchData();
    }, [workentryUrl]);

    useEffect(() => {
        if (filter === null) {
            return setFilteredWorkentries(workentries);
        }
        let filteredWorkentries = [];
        switch (filter.filterRubric) {
            case "project":
                filteredWorkentries = workentries.filter((x) => x && x.project && x.project.project.includes(filter.filterText));
                break;
            case "category":
                filteredWorkentries = workentries.filter((x) => x && x.category && x.category.category.includes(filter.filterText));
                break;
            case "id":
                filteredWorkentries = workentries.filter((x) => x && x._id && x._id.includes(filter.filterText));
                break;
            case "optionalText":
                filteredWorkentries = workentries.filter((x) => x && x.optionalText && x.optionalText.includes(filter.filterText));
        }
        setFilteredWorkentries(filteredWorkentries);
    }, [filter]);

    async function handleDelete(id) {
        try {
            await fetch(`${workentryUrl}/${id}`, { method: "DELETE" });
            fetchData();

            //   let resp = await fetch(`${workentryUrl}/${w._id}`, {
            //     method: "delete",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({
            //         id: w._id,
            //     }),
            // });
            // console.log(resp);
            // resp = await resp.text();
            // console.log("Deleted successfully", resp);
            // fetchData();
        } catch (err) {
            console.error(err);
        }
    }

    function calculateDuration(t1, t2) {
        let [hours, minutes] = t1.split(":");
        let [hours2, minutes2] = t2.split(":");
        hours = hours * 60;
        let time1 = Number(hours) + Number(minutes);
        hours2 = hours2 * 60;
        let time2 = Number(hours2) + Number(minutes2);
        let duration = time2 - time1;
        let durationHours = Math.floor(duration / 60);
        let durationMinutes = duration % 60;
        durationMinutes = durationMinutes.toString().length < 2 ? `0${durationMinutes}` : durationMinutes;
        return `${durationHours}:${durationMinutes} h`;
    }

    async function handleUpdate() {
        console.log("handleUpdate", updateData);
        return;
        let resp = await fetch(`${workentryUrl}/${updateData._id}`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: updateData._id,
                category: updateData.category,
                project: updateData.project,
                fromDate: updateData.fromDate,
                untilDate: updateData.untilData,
                optionalText: updateData.optionalText,
            }),
        });
        console.log(resp);
        resp = await resp.text();
        console.log("Updated successfully", resp);
        fetchData();
        setUpdateData(null);
    }

    return (
        <Container fluid className="data-container">
            <Row className="data-header align-items-center">
                <Col className="list-header-row" sm={2}>
                    <Dropdown as={ButtonGroup} className="w-100">
                        <Dropdown.Toggle className="filter-button w-75" variant="light">
                            Projekt {filterIcon()}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <FormControl
                                autoFocus
                                className="mx-3 my-2 w-auto"
                                placeholder="Type to filter..."
                                value={filter ? (filter.filterRubric === "project" ? filter.filterText : "") : ""}
                                onChange={(e) => setFilter({ filterRubric: "project", filterText: e.target.value })}
                                // onChange={(e) => setValue(e.target.value)}
                                // value={value}
                            />
                            {/* <Dropdown.Item eventKey="1">Red</Dropdown.Item>
                            <Dropdown.Item eventKey="2">Blue</Dropdown.Item>
                            <Dropdown.Item eventKey="3" active>
                                Orange
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="1">Red-Orange</Dropdown.Item> */}
                            <Dropdown.Item onClick={() => setFilter(null)}>Reset Filter X</Dropdown.Item>
                            {projects.map((p) => (
                                <Dropdown.Item eventKey={p._id} onClick={() => setFilter({ filterRubric: "project", filterText: p.project })}>
                                    {p.project}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                        <Button
                            variant="light"
                            className="filter-button w-25"
                            onClick={() => {
                                setSort({ name: "project.project", asc: sort.asc ? !sort.asc : true });
                            }}
                        >
                            {/* {sort.name === "project.project" ? sort.asc ? <span>▲</span> : <span>▼</span> : <span>▵</span>} */}
                            {sort.name === "project.project" ? (sort.asc ? sortAlphaUpIcon() : sortAlphaDownIcon()) : sortAlphaUpIcon()}
                        </Button>
                    </Dropdown>
                </Col>
                <Col
                    className="list-header-row"
                    // onClick={() => {
                    //     setSort({ name: "category.category", asc: sort.asc ? !sort.asc : true });
                    // }}
                    sm={2}
                >
                    <Dropdown as={ButtonGroup} className="w-100">
                        <Dropdown.Toggle className="filter-button w-75" variant="light">
                            Kategorie
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <FormControl
                                autoFocus
                                className="mx-3 my-2 w-auto"
                                placeholder="Type to filter..."
                                value={filter ? (filter.filterRubric === "category" ? filter.filterText : "") : ""}
                                onChange={(e) => setFilter({ filterRubric: "category", filterText: e.target.value })}
                                // onChange={(e) => setValue(e.target.value)}
                                // value={value}
                            />
                            <Dropdown.Item onClick={() => setFilter(null)}>Reset Filter X</Dropdown.Item>
                            {categories.map((c) => (
                                <Dropdown.Item eventKey={c._id} onClick={() => setFilter({ filterRubric: "category", filterText: c.category })}>
                                    {c.category}
                                </Dropdown.Item>
                            ))}
                            {/* <Dropdown.Item eventKey="1">Red</Dropdown.Item>
                            <Dropdown.Item eventKey="2">Blue</Dropdown.Item>
                            <Dropdown.Item eventKey="3" active>
                                Orange
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="1">Red-Orange</Dropdown.Item> */}
                        </Dropdown.Menu>
                        <Button
                            variant="light"
                            className="filter-button w-25"
                            onClick={() => {
                                setSort({ name: "category.category", asc: sort.asc ? !sort.asc : true });
                            }}
                        >
                            {sort.name === "category.category" ? (sort.asc ? sortAlphaUpIcon() : sortAlphaDownIcon()) : sortAlphaUpIcon()}
                        </Button>
                    </Dropdown>
                    {/* <Dropdown>
                        <Dropdown.Toggle variant="light" className="filter-button">
                            Kategorie
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <FormControl
                                autoFocus
                                className="mx-3 my-2 w-auto"
                                placeholder="Type to filter..."
                                // onChange={(e) => setValue(e.target.value)}
                                // value={value}
                            />
                            <Dropdown.Item eventKey="1">Red</Dropdown.Item>
                            <Dropdown.Item eventKey="2">Blue</Dropdown.Item>
                            <Dropdown.Item eventKey="3" active>
                                Orange
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="1">Red-Orange</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown> */}
                    {/* Kategorie {sort.name === "category.category" ? sort.asc ? <span>▲</span> : <span>▼</span> : <span>▵</span>} */}
                </Col>
                <Col
                    className="list-header-row"
                    // onClick={() => {
                    //     setSort({ name: "optionalText", asc: sort.asc ? !sort.asc : true });
                    // }}
                    sm={2}
                >
                    <Dropdown as={ButtonGroup} className="w-100">
                        <Dropdown.Toggle className="filter-button w-75" variant="light">
                            Kommentar
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <FormControl
                                autoFocus
                                className="mx-3 my-2 w-auto"
                                placeholder="Type to filter..."
                                value={filter ? (filter.filterRubric === "optionalText" ? filter.filterText : "") : ""}
                                onChange={(e) => setFilter({ filterRubric: "optionalText", filterText: e.target.value })}
                            />
                            <Dropdown.Item onClick={() => setFilter(null)}>Reset Filter X</Dropdown.Item>
                        </Dropdown.Menu>
                        <Button
                            variant="light"
                            className="filter-button w-25"
                            onClick={() => {
                                setSort({ name: "optionalText", asc: sort.asc ? !sort.asc : true });
                            }}
                        >
                            {sort.name === "optionalText" ? (sort.asc ? sortAlphaUpIcon() : sortAlphaDownIcon()) : sortAlphaUpIcon()}
                        </Button>
                    </Dropdown>
                    {/* <Dropdown>
                        <Dropdown.Toggle variant="light" className="filter-button">
                            Kommentar
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <FormControl
                                autoFocus
                                className="mx-3 my-2 w-auto"
                                placeholder="Type to filter..."
                                // onChange={(e) => setValue(e.target.value)}
                                // value={value}
                            />
                            <Dropdown.Item eventKey="1">Red</Dropdown.Item>
                            <Dropdown.Item eventKey="2">Blue</Dropdown.Item>
                            <Dropdown.Item eventKey="3" active>
                                Orange
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="1">Red-Orange</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown> */}
                    {/* Kommentar {sort.name === "optionalText" ? sort.asc ? <span>▲</span> : <span>▼</span> : <span>▵</span>} */}
                </Col>
                <Col className="list-header-row" sm={2}>
                    <Dropdown as={ButtonGroup} className="w-100">
                        <Dropdown.Toggle className="filter-button w-75" variant="light">
                            Von - Bis
                        </Dropdown.Toggle>

                        {/* <Dropdown.Menu>
                            <FormControl
                                autoFocus
                                className="mx-3 my-2 w-auto"
                                placeholder="Type to filter..."
                                // onChange={(e) => setValue(e.target.value)}
                                // value={value}
                            />
                            <Dropdown.Item eventKey="1">Red</Dropdown.Item>
                            <Dropdown.Item eventKey="2">Blue</Dropdown.Item>
                            <Dropdown.Item eventKey="3" active>
                                Orange
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="1">Red-Orange</Dropdown.Item>
                        </Dropdown.Menu> */}
                        <Button
                            variant="light"
                            className="filter-button w-25"
                            onClick={() => {
                                setSort({ name: "fromDate", asc: sort.asc ? !sort.asc : true });
                            }}
                        >
                            {sort.name === "fromDate" ? (sort.asc ? sortNumericUpIcon() : sortNumericDownIcon()) : sortNumericUpIcon()}
                        </Button>
                    </Dropdown>
                    {/* Von - Bis */}
                    {/* <Dropdown>
                        <Dropdown.Toggle variant="light" className="filter-button">
                            Von - Bis
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <FormControl
                                autoFocus
                                className="mx-3 my-2 w-auto"
                                placeholder="Type to filter..."
                                // onChange={(e) => setValue(e.target.value)}
                                // value={value}
                            />
                            <Dropdown.Item eventKey="1">Red</Dropdown.Item>
                            <Dropdown.Item eventKey="2">Blue</Dropdown.Item>
                            <Dropdown.Item eventKey="3" active>
                                Orange
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="1">Red-Orange</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown> */}
                </Col>
                <Col className="list-header-row" sm={2}>
                    <Dropdown as={ButtonGroup} className="w-100">
                        <Dropdown.Toggle className="filter-button w-75" variant="light">
                            Dauer
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <FormControl
                                autoFocus
                                className="mx-3 my-2 w-auto"
                                placeholder="Type to filter..."
                                // onChange={(e) => setValue(e.target.value)}
                                // value={value}
                            />
                            <Dropdown.Item eventKey="1">Red</Dropdown.Item>
                            <Dropdown.Item eventKey="2">Blue</Dropdown.Item>
                            <Dropdown.Item eventKey="3" active>
                                Orange
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="1">Red-Orange</Dropdown.Item>
                        </Dropdown.Menu>
                        <Button
                            variant="light"
                            className="filter-button w-25"
                            onClick={() => {
                                setSort({ name: "duration", asc: sort.asc ? !sort.asc : true });
                            }}
                        >
                            {sort.name === "duration" ? (sort.asc ? sortNumericUpIcon() : sortNumericDownIcon()) : sortNumericUpIcon()}
                        </Button>
                    </Dropdown>
                    {/* <Dropdown>
                        <Dropdown.Toggle variant="light" className="filter-button">
                            Dauer
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <FormControl
                                autoFocus
                                className="mx-3 my-2 w-auto"
                                placeholder="Type to filter..."
                                // onChange={(e) => setValue(e.target.value)}
                                // value={value}
                            />
                            <Dropdown.Item eventKey="1">Red</Dropdown.Item>
                            <Dropdown.Item eventKey="2">Blue</Dropdown.Item>
                            <Dropdown.Item eventKey="3" active>
                                Orange
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="1">Red-Orange</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown> */}
                </Col>
                <Col className="list-header-row" sm={2}></Col>
            </Row>
            {/* <Row>
                <Col sm={1} className="m-0 p-0">
          <InputGroup className="">
            <FormControl
              value={filter ? (filter.filterRubric === "id" ? filter.filterText : "") : ""}
              onChange={(e) => setFilter({ filterRubric: "id", filterText: e.target.value })}
              placeholder="id"
              aria-label="id"
            />
          </InputGroup>
        </Col>
                <Col className="m-0 p-0" sm={2}>
                    <InputGroup className="">
                        <FormControl
                            placeholder="project"
                            aria-label="project"
                            value={filter ? (filter.filterRubric === "project" ? filter.filterText : "") : ""}
                            onChange={(e) => setFilter({ filterRubric: "project", filterText: e.target.value })}
                        />
                    </InputGroup>
                </Col>
                <Col className="m-0 p-0" sm={2}>
                    <InputGroup className="">
                        <FormControl
                            value={filter ? (filter.filterRubric === "category" ? filter.filterText : "") : ""}
                            onChange={(e) => setFilter({ filterRubric: "category", filterText: e.target.value })}
                            placeholder="category"
                            aria-label="category"
                        />
                    </InputGroup>
                </Col>
                <Col className="m-0 p-0" sm={4}>
                    <InputGroup className="">
                        <FormControl
                            value={filter ? (filter.filterRubric === "optionalText" ? filter.filterText : "") : ""}
                            onChange={(e) => setFilter({ filterRubric: "optionalText", filterText: e.target.value })}
                            placeholder="optionalText"
                            aria-label="optionalText"
                        />
                    </InputGroup>
                </Col>
                <Col sm={1}></Col>
                <Col sm={1}></Col>
                <Col sm={1}></Col>
            </Row> */}
            {filteredWorkentries.map((w) => (
                <Row key={w._id} className="align-items-center data-row">
                    <Col sm={2} className={!!updateData && w._id === updateData._id ? "p-0" : ""}>
                        {!!updateData && w._id === updateData._id ? (
                            <Dropdown>
                                <Dropdown.Toggle className="filter-button w-100" variant="light">
                                    {updateData.project.project || ""}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {projects.map((p) => (
                                        <Dropdown.Item
                                            eventKey={p._id}
                                            onClick={() => setUpdateData({ ...updateData, project: { _id: p._id, project: p.project } })}
                                        >
                                            {p.project}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : w.project ? (
                            w.project.project
                        ) : (
                            "Unbekanntes Projekt"
                        )}
                    </Col>
                    <Col sm={2} className={!!updateData && w._id === updateData._id ? "p-0" : ""}>
                        {!!updateData && w._id === updateData._id ? (
                            // <InputGroup>
                            //     <FormControl value={updateData.category.category}></FormControl>
                            // </InputGroup>
                            <Dropdown>
                                <Dropdown.Toggle variant="light" className="filter-button w-100">
                                    {updateData.category.category || ""}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {categories.map((c) => (
                                        <Dropdown.Item
                                            eventKey={c._id}
                                            onClick={() => setUpdateData({ ...updateData, category: { _id: c._id, category: c.category } })}
                                        >
                                            {c.category}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : w.category ? (
                            w.category.category
                        ) : (
                            "Unbekannte Kategorie"
                        )}
                    </Col>
                    <Col sm={2} className={!!updateData && w._id === updateData._id ? "p-0" : ""}>
                        {!!updateData && w._id === updateData._id ? (
                            <InputGroup>
                                <FormControl
                                    value={updateData.optionalText}
                                    onChange={(e) => setUpdateData({ ...updateData, optionalText: e.target.value })}
                                ></FormControl>
                            </InputGroup>
                        ) : (
                            w.optionalText
                        )}
                    </Col>
                    <Col sm={2} className={!!updateData && w._id === updateData._id ? "p-0" : ""}>
                        {!!updateData && w._id === updateData._id ? (
                            <InputGroup>
                                <FormControl
                                    value={updateData.fromDate}
                                    onChange={(e) => setUpdateData({ ...updateData, fromDate: e.target.value })}
                                ></FormControl>
                                <FormControl
                                    value={updateData.untilDate}
                                    onChange={(e) => setUpdateData({ ...updateData, untilDate: e.target.value })}
                                ></FormControl>
                            </InputGroup>
                        ) : (
                            `${w.fromDate} - ${w.untilDate}`
                        )}
                    </Col>
                    <Col sm={2} className={!!updateData && w._id === updateData._id ? "p-0" : ""}>
                        {!!updateData && w._id === updateData._id ? (
                            <InputGroup>
                                <FormControl disabled value={calculateDuration(w.fromDate, w.untilDate)}></FormControl>
                            </InputGroup>
                        ) : (
                            calculateDuration(w.fromDate, w.untilDate)
                        )}
                    </Col>
                    <Col sm={2}>
                        {/* <Button variant="danger" size="sm" onClick={() => handleDelete(w._id)}>
              <BsFillTrashFill />
            </Button> */}
                        {!!updateData && w._id === updateData._id ? (
                            <Button size="sm" onClick={handleUpdate} variant="primary">
                                <BsFillBookmarkFill />
                            </Button>
                        ) : (
                            <>
                                <Button size="sm" onClick={async () => setUpdateData({ ...w })} variant="dark">
                                    <BsGear />
                                </Button>
                            </>
                        )}
                        {!!updateData && w._id === updateData._id ? (
                            <Button size="sm" onClick={async () => setUpdateData(null)} variant="warning">
                                <BsFillXCircleFill />
                            </Button>
                        ) : (
                            <Button size="sm" onClick={async () => handleDelete(w._id)} variant="danger">
                                <BsFillTrashFill />
                            </Button>
                        )}
                    </Col>
                </Row>
            ))}
        </Container>
        // <Table striped bordered hover variant="light" size="sm" style={{ tableLayout: "fixed" }}>
        //   <thead>
        //     <tr>
        //       <th>#</th>
        //       <th>Project</th>
        //       <th>Category</th>
        //       <th>Optional</th>
        //       <th>Start</th>
        //       <th>End</th>
        //     </tr>
        //   </thead>
        //   <tbody>
        //     {workentries.map((w) => {
        //       return (
        //         <tr key={w._id}>
        //           <td>{w._id.substring(0, 8)}</td>
        //           <td>{w.project ? w.project.project : "Unbekanntes Projekt"}</td>
        //           <td>{w.category ? w.category.category : "Unbekannte Kategorie"}</td>
        //           <td>{w.optionalText}</td>
        //           <td>{w.fromDate}</td>
        //           <td>{w.untilDate}</td>
        //         </tr>
        //       );
        //     })}
        //   </tbody>
        // </Table>
    );
}
