import React, { useState, useEffect } from "react";
import { PROD_WORKENTRY_API, DEV_WORKENTRY_API, PROD_PROJECT_API, DEV_PROJECT_API, PROD_CATEGORY_API, DEV_CATEGORY_API } from "../../config/api.json";
import { Col, Container, Row, Button, FormControl, InputGroup, Dropdown, ButtonGroup, Form } from "react-bootstrap";
import sortList from "../../helpers";
import { BsFillTrashFill, BsGear, BsFillBookmarkFill, BsFillXCircleFill } from "react-icons/bs";
import moment from "moment";
import { CSVLink, CSVDownload } from "react-csv";

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

const CheckIcon = () => (
    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"
        />
    </svg>
);
const ResetIcon = () => (
    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
        />
    </svg>
);

const DownloadIcon = () => (
    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-download" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"
        />
        <path
            fillRule="evenodd"
            d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"
        />
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

const csvHeaders = [
    { label: "Projekt", key: "project.project" },
    { label: "Kategorie", key: "category.category" },
    { label: "Kommentar", key: "optionalText" },
    { label: "Datum", key: "date" },
    { label: "Von", key: "fromDate" },
    { label: "Von", key: "start" },
    { label: "Bis", key: "untilDate" },
    { label: "Bis", key: "end" },
    { label: "Extern", key: "external" },
];

export default function Workentry({ isDev }) {
    const filterEntries = {
        project: "",
        category: "",
        optionalText: "",
        date: "",
        start: "",
        end: "",
        duration: "",
        external: "",
    };
    let [workentries, setWorkentries] = useState([]);
    // let [filteredWorkentries, setFilteredWorkentries] = useState([]);
    let [categories, setCategories] = useState([]);
    let [projects, setProjects] = useState([]);
    let [filter, setFilter] = useState(filterEntries);
    let [updateData, setUpdateData] = useState(null);

    const DEV_URLS = { workentryUrl: DEV_WORKENTRY_API, categoryUrl: DEV_CATEGORY_API, projectUrl: DEV_PROJECT_API };
    const PROD_URLS = {
        workentryUrl: PROD_WORKENTRY_API,
        categoryUrl: PROD_CATEGORY_API,
        projectUrl: PROD_PROJECT_API,
    };

    const [urls, setUrls] = useState(isDev ? DEV_URLS : PROD_URLS);

    let [sort, setSort] = useState({ name: "category.category", asc: false });

    async function fetchData() {
        try {
            console.log(`Fetching from ${JSON.stringify(urls)}`);
            let [fetched_projects, workentries, fetched_categories] = await Promise.all([
                fetch(urls.projectUrl),
                fetch(urls.workentryUrl),
                fetch(urls.categoryUrl),
            ]);
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
    useEffect(async () => {
        setFilter({ ...filter, date: moment().format("YYYY-MM-DD") });
        await fetchData();
        // setFilter({ filterRubric: "date", filterText: moment().format("YYYY-MM-DD") });
    }, []);
    useEffect(() => {
        setWorkentries(workentries);
    }, [workentries]);

    useEffect(() => {
        console.log("useEffect sort");
        setWorkentries(sortList(sort, workentries));
    }, [sort]);

    useEffect(() => {
        console.log("isDev changed");
        setUrls(isDev ? { ...DEV_URLS } : { ...PROD_URLS });
    }, [isDev]);

    useEffect(() => {
        console.log("urls changed");
        console.log("urls", urls);
        fetchData();
    }, [urls]);

    useEffect(() => console.log(filter), [filter]);

    function _filter(itemToFilter) {
        const filterValues = Object.entries(filter);

        let showItemArray = filterValues.map((fi) => {
            let [filterType, filterValue] = fi;
            // console.log("filtertype", filterType, filterValue, itemToFilter);
            // if (filter === null || filter.filterRubric === null || filter.filterText === null) {
            //         console.log("empty filter");
            //         return true;
            // }
            switch (filterType) {
                case "project":
                    return itemToFilter.project && itemToFilter.project.project && itemToFilter.project.project.includes(filterValue);
                case "category":
                    return itemToFilter.category && itemToFilter.category.category && itemToFilter.category.category.includes(filterValue);
                case "optionalText":
                    return itemToFilter.optionalText.includes(filterValue);
                case "date":
                    return itemToFilter.date && itemToFilter.date.includes(filterValue);
                // case "external":
                //     return itemToFilter.external && itemToFilter.external === filterValue;
                default:
                    // console.log("filter default case, maybe something's wrong here");
                    return true;
            }
        });
        // console.log(showItemArray);
        return showItemArray.every((v) => !!v);
    }

    useEffect(() => {
        setWorkentries(workentries);
    }, [filter]);

    async function handleDelete(id) {
        try {
            await fetch(`${urls.workentryUrl}/${id}`, { method: "DELETE" });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    }

    function calculateDuration(t1, t2) {
        if (!t1 || !t2) {
            console.log("calcularteDuration", t1, t2);
            return `Fehlerhafte Dauer`;
        }
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
        const { _id, category, project, fromDate, untilDate, optionalText, date, start, end, external } = updateData;
        if (!_id || !category || !category._id || !project || !project._id || !start || !end) {
            alert("Fehlerhafte Dateneingabe, überprüfe auf benötigte Eingaben");
            setUpdateData(null);
            return;
        }
        let resp = await fetch(`${urls.workentryUrl}/${updateData._id}`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: _id,
                category: category._id,
                project: project._id,
                start,
                end,
                date,
                optionalText,
                external,
            }),
        });
        console.log(resp);
        resp = await resp.text();
        console.log("Updated successfully", resp);
        fetchData();
        setUpdateData(null);
    }

    function showFilterValues() {
        let filterValues = [];
        for (const [key, value] of Object.entries(filter)) {
            if (value !== "") {
                filterValues.push(`Filter: ${key}, Wert: ${value}`);
            }
        }
        return filterValues;
    }

    return (
        <Container fluid className="data-container">
            <Row>{`Aktive Filter: ${showFilterValues()}`}</Row>
            <Row className="data-header align-items-center">
                <Col className="list-header-row" sm={2}>
                    <Dropdown>
                        <Dropdown.Toggle className="filter-button w-100" variant="light">
                            Projekt {filterIcon()}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <FormControl
                                autoFocus
                                className="mx-3 my-2 w-auto"
                                placeholder="Type to filter..."
                                value={filter ? filter["project"] : ""}
                                onChange={(e) => setFilter({ ...filter, project: e.target.value })}
                            />
                            <ButtonGroup aria-label="Basic example" className="d-block mx-3 my-2 w-auto">
                                <Button
                                    className={sort.name === "project.project" && sort.asc ? "highlighted" : ""}
                                    variant="light"
                                    onClick={() => setSort({ name: "project.project", asc: true })}
                                >
                                    {sortAlphaUpIcon()}
                                </Button>
                                <Button
                                    className={sort.name === "project.project" && !sort.asc ? "highlighted" : ""}
                                    variant="light"
                                    onClick={() => setSort({ name: "project.project", asc: false })}
                                >
                                    {sortAlphaDownIcon()}
                                </Button>
                                <Button variant="light" onClick={() => setFilter({ ...filter, project: "" })}>
                                    {ResetIcon()}
                                </Button>
                            </ButtonGroup>
                            {/* <Dropdown.Item onClick={() => setFilter({ name: "", asc: undefined })}>Reset Filter X</Dropdown.Item> */}
                            {projects.map((p) => (
                                <Dropdown.Item eventKey={p._id} onClick={() => setFilter({ ...filter, project: p.project })}>
                                    {p.project}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                        {/* <Button
                            variant="light"
                            className="filter-button w-25"
                            onClick={() => setSort({ name: "project.project", asc: sort.asc ? !sort.asc : true })}
                        >
                            {sort.name === "project.project" ? (sort.asc ? sortAlphaUpIcon() : sortAlphaDownIcon()) : sortAlphaUpIcon()}
                        </Button> */}
                    </Dropdown>
                </Col>
                <Col className="list-header-row" sm={2}>
                    <Dropdown>
                        <Dropdown.Toggle className="filter-button w-100" variant="light">
                            Kategorie {filterIcon()}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <FormControl
                                autoFocus
                                className="mx-3 my-2 w-auto"
                                placeholder="Type to filter..."
                                value={filter ? filter["category"] : ""}
                                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                            />
                            <ButtonGroup aria-label="Basic example" className="d-block mx-3 my-2 w-auto">
                                <Button
                                    className={sort.name === "category.category" && sort.asc ? "highlighted" : ""}
                                    variant="light"
                                    onClick={() => setSort({ name: "category.category", asc: true })}
                                >
                                    {sortAlphaUpIcon()}
                                </Button>
                                <Button
                                    className={sort.name === "category.category" && !sort.asc ? "highlighted" : ""}
                                    variant="light"
                                    onClick={() => setSort({ name: "category.category", asc: false })}
                                >
                                    {sortAlphaDownIcon()}
                                </Button>
                                <Button variant="light" onClick={() => setFilter({ ...filter, project: "" })}>
                                    {ResetIcon()}
                                </Button>
                            </ButtonGroup>
                            {categories.map((c) => (
                                <Dropdown.Item eventKey={c._id} onClick={() => setFilter({ ...filter, category: c.category })}>
                                    {c.category}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col className="list-header-row" sm={2}>
                    <Dropdown>
                        <Dropdown.Toggle className="filter-button w-100" variant="light">
                            Kommentar {filterIcon()}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <FormControl
                                autoFocus
                                className="mx-3 my-2 w-auto"
                                placeholder="Type to filter..."
                                value={filter ? filter["optionalText"] : ""}
                                onChange={(e) => setFilter({ ...filter, optionalText: e.target.value })}
                            />
                            <ButtonGroup aria-label="Basic example" className="d-block mx-3 my-2 w-auto">
                                <Button
                                    className={sort.name === "optionalText" && sort.asc ? "highlighted" : ""}
                                    variant="light"
                                    onClick={() => setSort({ name: "optionalText", asc: true })}
                                >
                                    {sortAlphaUpIcon()}
                                </Button>
                                <Button
                                    className={sort.name === "optionalText" && !sort.asc ? "highlighted" : ""}
                                    variant="light"
                                    onClick={() => setSort({ name: "optionalText", asc: false })}
                                >
                                    {sortAlphaDownIcon()}
                                </Button>
                                <Button variant="light" onClick={() => setFilter({ ...filter, optionalText: "" })}>
                                    {ResetIcon()}
                                </Button>
                            </ButtonGroup>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col className="list-header-row" sm={1}>
                    <Dropdown>
                        <Dropdown.Toggle className="filter-button w-100" variant="light">
                            Datum {filterIcon()}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <FormControl
                                type="date"
                                autoFocus
                                className="mx-3 my-2 w-auto"
                                // placeholder="Type to filter..."
                                value={filter ? filter["date"] : ""}
                                onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                            />
                            <ButtonGroup aria-label="Basic example" className="d-block mx-3 my-2 w-auto">
                                <Button
                                    className={sort.name === "date" && sort.asc ? "highlighted" : ""}
                                    variant="light"
                                    onClick={() => setSort({ name: "date", asc: true })}
                                >
                                    {sortAlphaUpIcon()}
                                </Button>
                                <Button
                                    className={sort.name === "date" && !sort.asc ? "highlighted" : ""}
                                    variant="light"
                                    onClick={() => setSort({ name: "date", asc: false })}
                                >
                                    {sortAlphaDownIcon()}
                                </Button>
                                <Button variant="light" onClick={() => setFilter({ ...filter, date: "" })}>
                                    {ResetIcon()}
                                </Button>
                            </ButtonGroup>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col className="list-header-row" sm={1}>
                    <Dropdown>
                        <Dropdown.Toggle className="filter-button w-100" variant="light">
                            Von {filterIcon()}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <FormControl
                                type="text"
                                autoFocus
                                className="mx-3 my-2 w-auto"
                                value={filter ? filter["start"] : ""}
                                onChange={(e) => setFilter({ ...filter, start: e.target.value })}
                            />
                            <ButtonGroup aria-label="Basic example" className="d-block mx-3 my-2 w-auto">
                                <Button
                                    className={sort.name === "start" && sort.asc ? "highlighted" : ""}
                                    variant="light"
                                    onClick={() => setSort({ name: "start", asc: true })}
                                >
                                    {sortAlphaUpIcon()}
                                </Button>
                                <Button
                                    className={sort.name === "start" && !sort.asc ? "highlighted" : ""}
                                    variant="light"
                                    onClick={() => setSort({ name: "start", asc: false })}
                                >
                                    {sortAlphaDownIcon()}
                                </Button>
                                <Button variant="light" onClick={() => setFilter({ ...filter, start: "" })}>
                                    {ResetIcon()}
                                </Button>
                            </ButtonGroup>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col className="list-header-row" sm={1}>
                    <Dropdown>
                        <Dropdown.Toggle className="filter-button w-100" variant="light">
                            Bis {filterIcon()}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <FormControl
                                type="text"
                                autoFocus
                                className="mx-3 my-2 w-auto"
                                value={filter ? filter["end"] : ""}
                                onChange={(e) => setFilter({ ...filter, end: e.target.value })}
                            />
                            <ButtonGroup aria-label="Basic example" className="d-block mx-3 my-2 w-auto">
                                <Button
                                    className={sort.name === "end" && sort.asc ? "highlighted" : ""}
                                    variant="light"
                                    onClick={() => setSort({ name: "end", asc: true })}
                                >
                                    {sortAlphaUpIcon()}
                                </Button>
                                <Button
                                    className={sort.name === "end" && !sort.asc ? "highlighted" : ""}
                                    variant="light"
                                    onClick={() => setSort({ name: "end", asc: false })}
                                >
                                    {sortAlphaDownIcon()}
                                </Button>
                                <Button variant="light" onClick={() => setFilter({ ...filter, end: "" })}>
                                    {ResetIcon()}
                                </Button>
                            </ButtonGroup>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col className="list-header-row" sm={1}>
                    <Dropdown>
                        <Dropdown.Toggle className="filter-button w-100" variant="light">
                            Dauer {filterIcon()}
                        </Dropdown.Toggle>

                        {/* <Dropdown.Menu>
                            <FormControl
                                type="text"
                                autoFocus
                                className="mx-3 my-2 w-auto"
                                value={filter ? (filter.filterRubric === "start" ? filter.filterText : "") : ""}
                                onChange={(e) => setFilter({ filterRubric: "start", filterText: e.target.value })}
                            />
                            <ButtonGroup aria-label="Basic example" className="d-block mx-3 my-2 w-auto">
                                <Button
                                    className={sort.name === "start" && sort.asc ? "highlighted" : ""}
                                    variant="light"
                                    onClick={() => setSort({ name: "start", asc: true })}
                                >
                                    {sortAlphaUpIcon()}
                                </Button>
                                <Button
                                    className={sort.name === "start" && !sort.asc ? "highlighted" : ""}
                                    variant="light"
                                    onClick={() => setSort({ name: "start", asc: false })}
                                >
                                    {sortAlphaDownIcon()}
                                </Button>
                                <Button variant="light" onClick={() => setFilter(null)}>
                                    {ResetIcon()}
                                </Button>
                            </ButtonGroup>
                        </Dropdown.Menu> */}
                    </Dropdown>
                </Col>
                <Col className="list-header-row" sm={1}>
                    <Dropdown as={ButtonGroup} className="w-100">
                        <Dropdown.Toggle className="filter-button w-100" variant="light">
                            Extern {filterIcon()}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {/* <FormControl
                                type="checkbox"
                                autoFocus
                                className="mx-3 my-2 w-auto"
                                checked={filter ? (filter.filterRubric === "external" ? filter.filterText : false) : false}
                                onChange={(e) => setFilter({ filterRubric: "external", filterText: e.target.checked })}
                            /> */}
                            <Form>
                                <Form.Check
                                    type="checkbox"
                                    checked={filter ? filter["external"] : ""}
                                    onChange={(e) => setFilter({ ...filter, project: e.target.checked })}
                                ></Form.Check>
                            </Form>
                            <ButtonGroup aria-label="Basic example" className="d-block mx-3 my-2 w-auto">
                                <Button
                                    className={sort.name === "external" && sort.asc ? "highlighted" : ""}
                                    variant="light"
                                    onClick={() => setSort({ name: "external", asc: true })}
                                >
                                    {sortAlphaUpIcon()}
                                </Button>
                                <Button
                                    className={sort.name === "external" && !sort.asc ? "highlighted" : ""}
                                    variant="light"
                                    onClick={() => setSort({ name: "external", asc: false })}
                                >
                                    {sortAlphaDownIcon()}
                                </Button>
                                <Button variant="light" onClick={() => setFilter({ ...filter, project: undefined })}>
                                    {ResetIcon()}
                                </Button>
                            </ButtonGroup>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col className="list-header-row" sm={1}>
                    <Dropdown as={ButtonGroup} className="w-100">
                        <Dropdown.Toggle className="filter-button w-100" variant="light">
                            Download {DownloadIcon()}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="1">
                                <CSVLink data={workentries.filter(_filter)} headers={csvHeaders}>
                                    Download
                                </CSVLink>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
            {workentries.filter(_filter).map((w) => (
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
                    <Col sm={1} className={!!updateData && w._id === updateData._id ? "p-0" : ""}>
                        {!!updateData && w._id === updateData._id ? (
                            <InputGroup>
                                <FormControl
                                    type="date"
                                    value={updateData.date}
                                    onChange={(e) => setUpdateData({ ...updateData, date: e.target.value })}
                                ></FormControl>
                            </InputGroup>
                        ) : (
                            `${w.date ? w.date : "Unbekanntes Datum"}`
                        )}
                    </Col>
                    <Col sm={1} className={!!updateData && w._id === updateData._id ? "p-0" : ""}>
                        {!!updateData && w._id === updateData._id ? (
                            <InputGroup>
                                <FormControl
                                    type="time"
                                    value={updateData.start ? updateData.start : updateData.fromDate ? updateData.fromDate : ""}
                                    onChange={(e) => setUpdateData({ ...updateData, start: e.target.value })}
                                ></FormControl>
                            </InputGroup>
                        ) : (
                            `${w.start ? w.start : w.fromDate ? w.fromDate : "Unbekannte Uhrzeit"}`
                        )}
                    </Col>
                    <Col sm={1} className={!!updateData && w._id === updateData._id ? "p-0" : ""}>
                        {!!updateData && w._id === updateData._id ? (
                            <InputGroup>
                                <FormControl
                                    type="time"
                                    value={updateData.end ? updateData.end : updateData.untilDate ? updateData.untilDate : ""}
                                    onChange={(e) => setUpdateData({ ...updateData, end: e.target.value })}
                                ></FormControl>
                            </InputGroup>
                        ) : (
                            `${w.end ? w.end : w.untilDate ? w.untilDate : "Unbekannte Uhrzeit"}`
                        )}
                    </Col>
                    <Col sm={1} className={!!updateData && w._id === updateData._id ? "p-0" : ""}>
                        {!!updateData && w._id === updateData._id ? (
                            <InputGroup>
                                <FormControl
                                    type="number"
                                    disabled
                                    value={
                                        w.start && w.end
                                            ? calculateDuration(w.start, w.end)
                                            : w.fromDate && w.untilDate
                                            ? calculateDuration(w.fromDate, w.untilDate)
                                            : "Keine Dauer verfügbar"
                                    }
                                ></FormControl>
                            </InputGroup>
                        ) : w.start && w.end ? (
                            calculateDuration(w.start, w.end)
                        ) : w.fromDate && w.untilDate ? (
                            calculateDuration(w.fromDate, w.untilDate)
                        ) : (
                            "Keine Dauer verfügbar"
                        )}
                    </Col>
                    <Col sm={1} className={!!updateData && w._id === updateData._id ? "p-0" : ""}>
                        {!!updateData && w._id === updateData._id ? (
                            <Form>
                                <Form.Check
                                    type="checkbox"
                                    checked={updateData.external}
                                    onChange={(e) => setUpdateData({ ...updateData, external: e.target.checked })}
                                ></Form.Check>
                            </Form>
                        ) : // <InputGroup className="justify-content-center">
                        //     <FormControl
                        //         size="sm"
                        //         type="checkbox"
                        //         checked={updateData.external}
                        //         onChange={(e) => setUpdateData({ ...updateData, external: e.target.checked })}
                        //     ></FormControl>
                        //     {/* <InputGroup.Checkbox aria-label="Checkbox for following text input" /> */}
                        // </InputGroup>
                        w.external ? (
                            CheckIcon()
                        ) : (
                            ""
                        )}
                    </Col>
                    <Col sm={1}>
                        {!!updateData && w._id === updateData._id ? (
                            <ButtonGroup>
                                <Button onClick={handleUpdate} variant="primary">
                                    <BsFillBookmarkFill />
                                </Button>
                                <Button onClick={async () => setUpdateData(null)} variant="warning">
                                    <BsFillXCircleFill />
                                </Button>
                            </ButtonGroup>
                        ) : (
                            <ButtonGroup>
                                <Button onClick={async () => setUpdateData({ ...w })} variant="dark">
                                    <BsGear />
                                </Button>
                                <Button onClick={async () => handleDelete(w._id)} variant="danger">
                                    <BsFillTrashFill />
                                </Button>
                            </ButtonGroup>
                        )}
                    </Col>
                </Row>
            ))}
        </Container>
    );
}
