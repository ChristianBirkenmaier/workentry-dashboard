import React, { useState, useEffect } from "react";
import { PROD_WORKENTRY_API, DEV_WORKENTRY_API, PROD_PROJECT_API, DEV_PROJECT_API, PROD_CATEGORY_API, DEV_CATEGORY_API } from "../../config/api.json";
import { Col, Container, Row, Button, FormControl, InputGroup, Dropdown, ButtonGroup, Form, Badge } from "react-bootstrap";
import sortList from "../../helpers";
import { BsFillTrashFill, BsGear, BsFillBookmarkFill, BsFillXCircleFill } from "react-icons/bs";
import moment from "moment";
import { CSVLink, CSVDownload } from "react-csv";
import { filterIcon, resetIcon, downloadIcon, checkIcon, sortAlphaDownIcon, sortAlphaUpIcon, sortNumericUpIcon, sortNumericDownIcon } from "../../assets/icons";

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
    let [filteredWorkentries, setFilteredWorkentries] = useState([]);
    let [categories, setCategories] = useState([]);
    let [projects, setProjects] = useState([]);
    // let [filter, setFilter] = useState(filterEntries);
    let [filter, setFilter] = useState([{ filterRubric: "date", filterText: moment().format("YYYY-MM-DD") }]);
    let [updateData, setUpdateData] = useState(null);
    let [count, setCount] = useState(0);
    let [skip, setSkip] = useState(0);
    let [limit, setLimit] = useState(20);

    const DEV_URLS = { workentryUrl: DEV_WORKENTRY_API, categoryUrl: DEV_CATEGORY_API, projectUrl: DEV_PROJECT_API };
    const PROD_URLS = {
        workentryUrl: PROD_WORKENTRY_API,
        categoryUrl: PROD_CATEGORY_API,
        projectUrl: PROD_PROJECT_API,
    };

    const [urls, setUrls] = useState(isDev ? DEV_URLS : PROD_URLS);

    let [sort, setSort] = useState({ name: "category.category", asc: false });

    function buildWorkentryQueryString() {
        let paramString = filter
            .map((f) => `&${f.filterRubric}=${f.filterText}`)
            .toString()
            .replaceAll(",", "");

        let string = `${urls.workentryUrl}?limit=${limit}&skip=${skip}${paramString}`;

        return string;
    }

    async function fetchData() {
        try {
            // console.log(`Fetching from ${JSON.stringify(urls)}`);
            let workentryQuery = buildWorkentryQueryString();
            console.log(workentryQuery);
            let [fetched_projects, workentries, fetched_categories] = await Promise.all([
                fetch(urls.projectUrl),
                fetch(workentryQuery),
                fetch(urls.categoryUrl),
            ]);
            workentries = await workentries.json();
            fetched_categories = await fetched_categories.json();
            fetched_projects = await fetched_projects.json();
            setCategories(sortList({ name: "category", asc: true }, fetched_categories.data));
            setProjects(sortList({ name: "project", asc: true }, fetched_projects.data));
            setWorkentries(workentries.data);
        } catch (err) {
            console.error(err);
            setWorkentries([]);
        }
    }
    useEffect(async () => {
        await fetchData();
    }, [filter]);

    // useEffect(async () => {
    //     await fetchData();
    // }, []);
    // useEffect(() => {
    //     // buildWorkentryQueryString()
    //     console.log("useeffect workentries, filter");
    //     if (filter.length === 0) {
    //         return setFilteredWorkentries(workentries);
    //     }
    //     console.log(filter);
    //     console.log(workentries);
    //     setFilteredWorkentries(workentries.filter(_filter));
    // }, [workentries, filter]);

    useEffect(() => {
        setFilteredWorkentries(sortList(sort, filteredWorkentries));
    }, [sort]);

    useEffect(() => {
        setUrls(isDev ? { ...DEV_URLS } : { ...PROD_URLS });
    }, [isDev]);

    useEffect(() => {
        fetchData();
    }, [urls]);

    useEffect(() => console.log("Count", count), [count]);

    function _filter(itemToFilter) {
        // setCount(count++);

        let show = true;
        filter.forEach((f) => {
            let { filterRubric, filterText } = f;
            switch (filterRubric) {
                case "project":
                    show = itemToFilter.project && itemToFilter.project.project && itemToFilter.project.project.includes(filterText);
                    console.log("show", show);
                    break;
                case "category":
                    show = itemToFilter.category && itemToFilter.category.category && itemToFilter.category.category.includes(filterText);
                    break;
                case "optionalText":
                    show = itemToFilter.optionalText.includes(filterText);
                    break;
                case "date":
                    show = itemToFilter.date ? itemToFilter.date.includes(filterText) : true;
                    break;
                // case "external":
                //     return itemToFilter.external && itemToFilter.external === filterValue;
                default:
                    console.log("filter default case, maybe something's wrong here");
                    show = true;
                    break;
            }
        });
        return show;
    }

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
            // console.log("calcularteDuration", t1, t2);
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
        // console.log("handleUpdate", updateData);
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
        // console.log(resp);
        resp = await resp.text();
        // console.log("Updated successfully", resp);
        fetchData();
        setUpdateData(null);
    }

    function showFilterValues() {
        let filterValues = [];
        // for (const [key, value] of Object.entries(filter)) {
        //     if (value !== "") {
        //         filterValues.push(`Filter: ${key}, Wert: ${value}`);
        //     }
        // }
        if (!filter) return;
        let r = filter.map((f) => (
            <span
                onClick={() => setFilter(filter.filter((x) => x.filterRubric != f.filterRubric && x.filterText != f.filterText))}
            >{`Typ: ${f.filterRubric}, Wert: ${f.filterText}`}</span>
        ));
        // console.log(r);
        return r;
    }

    function getFilterValue(identifier) {
        let filterEntries = filter.filter((f) => f.filterRubric === identifier);
        if (typeof filterEntries === "object") {
            if (filterEntries.length > 0) {
                let filterEntry = filterEntries[0];
                if (typeof filterEntry === "object") {
                    let filterValue = filterEntry.filterText;
                    return filterValue;
                }
            }
        }
        return "";
    }

    function mapFilterIdToFilterName(filterRubric, filterText) {
        if (filterRubric !== "project" && filterRubric !== "category") {
            return filterText;
        }
        switch (filterRubric) {
            case "project":
                return projects.filter((p) => p._id === filterText)[0].project;
            case "category":
                return categories.filter((c) => c._id === filterText)[0].category;
        }
    }

    return (
        <Container fluid className="data-container">
            <Row>
                <Col className="d-flex align-items-center">
                    {filter.map((f) => (
                        <Badge
                            pill
                            variant="warning d-inline-flex align-items-center"
                            style={{ cursor: "pointer" }}
                            onClick={() => setFilter([...filter.filter((x) => x.filterRubric != f.filterRubric && x.filterText != f.filterText)])}
                        >
                            {mapFilterIdToFilterName(f.filterRubric, f.filterText)} {resetIcon()}
                            {/* {
                                <span
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setFilter([...filter.filter((x) => x.filterRubric != f.filterRubric && x.filterText != f.filterText)])}
                                >
                                   
                                </span>
                            } */}
                        </Badge>
                    ))}
                </Col>
            </Row>
            <Row className="data-header align-items-center">
                <Col className="list-header-row" sm={2}>
                    <Dropdown>
                        <Dropdown.Toggle className="filter-button w-100" variant="light">
                            Projekt {filterIcon()}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {/* <FormControl
                                autoFocus
                                className="mx-3 my-2 w-auto"
                                placeholder="Type to filter..."
                                value={filter ? filter["project"] : ""}
                                onChange={(e) => setFilter({ ...filter, project: e.target.value })}
                            /> */}
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
                                {/* <Button variant="light" onClick={() => setFilter({ ...filter, project: "" })}>
                                    {resetIcon()}
                                </Button> */}
                            </ButtonGroup>
                            {/* <Dropdown.Item onClick={() => setFilter({ name: "", asc: undefined })}>Reset Filter X</Dropdown.Item> */}
                            {projects.map((p) => (
                                <Dropdown.Item
                                    eventKey={p._id}
                                    onClick={() =>
                                        setFilter([...filter.filter((f) => f.filterRubric !== "project"), { filterRubric: "project", filterText: p._id }])
                                    }
                                >
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
                            {/* <FormControl
                                autoFocus
                                className="mx-3 my-2 w-auto"
                                placeholder="Type to filter..."
                                value={filter ? filter["category"] : ""}
                                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                            /> */}
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
                                {/* <Button variant="light" onClick={() => setFilter({ ...filter, category: "" })}>
                                    {resetIcon()}
                                </Button> */}
                            </ButtonGroup>
                            {categories.map((c) => (
                                <Dropdown.Item
                                    eventKey={c._id}
                                    onClick={() =>
                                        setFilter([...filter.filter((f) => f.filterRubric !== "category"), { filterRubric: "category", filterText: c._id }])
                                    }
                                >
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
                            {/* <FormControl
                                autoFocus
                                className="mx-3 my-2 w-auto"
                                placeholder="Type to filter..."
                                value={filter ? filter["optionalText"] : ""}
                                onChange={(e) => setFilter({ ...filter, optionalText: e.target.value })}
                            /> */}
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
                                {/* <Button variant="light" onClick={() => setFilter({ ...filter, optionalText: "" })}>
                                    {resetIcon()}
                                </Button> */}
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
                                // value={filter ? filter["date"] : ""}
                                // value={() => {
                                //     let val = filter.filter((f) => f.filterRubric === "date");
                                //     console.log("val", val);
                                //     return val ? val[0] : null;
                                // }}
                                // value={filter.filter((f) => f.filterRubric === "date")[0].filterText || "2020-12-03"}
                                value={getFilterValue("date")}
                                // onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                                onChange={(e) =>
                                    setFilter([...filter.filter((f) => f.filterRubric !== "date"), { filterRubric: "date", filterText: e.target.value }])
                                }
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
                                {/* <Button variant="light" onClick={() => setFilter({ ...filter, date: "" })}>
                                    {resetIcon()}
                                </Button> */}
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
                            {/* <FormControl
                                type="text"
                                autoFocus
                                className="mx-3 my-2 w-auto"
                                value={filter ? filter["start"] : ""}
                                onChange={(e) => setFilter({ ...filter, start: e.target.value })}
                            /> */}
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
                                {/* <Button variant="light" onClick={() => setFilter({ ...filter, start: "" })}>
                                    {resetIcon()}
                                </Button> */}
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
                            {/* <FormControl
                                type="text"
                                autoFocus
                                className="mx-3 my-2 w-auto"
                                value={filter ? filter["end"] : ""}
                                onChange={(e) => setFilter({ ...filter, end: e.target.value })}
                            /> */}
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
                                {/* <Button variant="light" onClick={() => setFilter({ ...filter, end: "" })}>
                                    {resetIcon()}
                                </Button> */}
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
                                    {resetIcon()}
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
                                    checked={getFilterValue("external")}
                                    // onChange={(e) => setFilter({ ...filter, project: e.target.checked })}
                                    onChange={(e) =>
                                        setFilter([
                                            ...filter.filter((f) => f.filterRubric !== "external"),
                                            { filterRubric: "external", filterText: e.target.checked },
                                        ])
                                    }
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
                                {/* <Button variant="light" onClick={() => setFilter({ ...filter, project: undefined })}>
                                    {resetIcon()}
                                </Button> */}
                            </ButtonGroup>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col className="list-header-row" sm={1}>
                    <Dropdown as={ButtonGroup} className="w-100">
                        <Dropdown.Toggle className="filter-button w-100" variant="light">
                            Download {downloadIcon()}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="1">
                                <CSVLink data={filteredWorkentries} headers={csvHeaders}>
                                    Download
                                </CSVLink>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
            {workentries.length ? (
                workentries.map((w) => (
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
                                checkIcon()
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
                ))
            ) : (
                <Row className="align-items-center data-row">
                    <Col sm={12}>Keine Einträge vorhanden, eventuell Filter überprüfen</Col>
                </Row>
            )}
        </Container>
    );
}
