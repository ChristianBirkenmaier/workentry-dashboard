import sortList from "../../../helpers";
import { filterIcon, resetIcon, checkIcon, sortAlphaDownIcon, sortAlphaUpIcon } from "../../../assets/icons";
import { Badge } from "react-bootstrap";
import { Col, Container, Row, Button, FormControl, InputGroup, Dropdown, ButtonGroup, Form } from "react-bootstrap";
import { CSVLink } from "react-csv";

export function buildWorkentryQueryString({ filter, urls, limit, skip }) {
    let paramString = filter
        .map((f) => `&${f.filterRubric}=${f.filterText}`)
        .toString()
        .replaceAll(",", "");

    let string = `${urls.workentryUrl}?limit=${limit}&skip=${skip}${paramString}`;

    return string;
}

export async function fetchData({
    filter,
    urls,
    limit,
    skip,
    setCategories,
    setProjects,
    setWorkentries,
    setIsLoading,
}) {
    try {
        let workentryQuery = buildWorkentryQueryString({ filter, urls, limit, skip });
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
        setWorkentries(
            workentries.data.map((w) => {
                return {
                    ...w,
                    duration:
                        w.start && w.end
                            ? calculateDuration(w.start, w.end)
                            : calculateDuration(w.fromDate, w.untilDate),
                };
            })
        );
        setIsLoading(false);
    } catch (err) {
        console.error(err);
        setWorkentries([]);
    }
}
export function calculateDuration(t1, t2) {
    if (!t1 || !t2) {
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

export function getFilterValue({ identifier, filter }) {
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

export function showActiveFilters({ filter, setFilter, projects, categories }) {
    return filter.map((f) => (
        <Badge
            pill
            variant="warning d-inline-flex align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() =>
                setFilter([...filter.filter((x) => x.filterRubric != f.filterRubric && x.filterText != f.filterText)])
            }
        >
            {getFilterRubricName(f.filterRubric)}:{" "}
            {getFilterName({ filterRubric: f.filterRubric, filterText: f.filterText, projects, categories })}{" "}
            {resetIcon()}
        </Badge>
    ));
}

function getFilterRubricName(filterRubric) {
    switch (filterRubric) {
        case "project":
            return "Projekt";
        case "category":
            return "Kategorie";
        case "external":
            return "Extern";
        case "date":
            return "Datum";
        default:
            return filterRubric;
    }
}

function getFilterName({ filterRubric, filterText, projects, categories }) {
    switch (filterRubric) {
        case "project":
            return projects.filter((p) => p._id === filterText)[0].project;
        case "category":
            return categories.filter((c) => c._id === filterText)[0].category;
        case "external":
            console.log(filterText);
            return filterText ? "Extern" : "Intern";
        default:
            return filterText;
    }
}

export async function handleUpdate({ updateData, setUpdateData, urls, loadData }) {
    let { _id, category, project, fromDate, untilDate, optionalText, date, start, end, external } = updateData;
    if (fromDate && !start) {
        start = fromDate;
    }
    if (untilDate && !end) {
        end = untilDate;
    }
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
    loadData();
    setUpdateData(null);
}

export async function handleDelete({ id, urls, loadData }) {
    try {
        await fetch(`${urls.workentryUrl}/${id}`, { method: "DELETE" });
        loadData();
    } catch (err) {
        console.error(err);
    }
}

export function getProjectHeader({ sort, setSort, projects, filter, setFilter }) {
    return (
        <Dropdown>
            <Dropdown.Toggle className="filter-button w-100" variant="light">
                Projekt {filterIcon()}
            </Dropdown.Toggle>

            <Dropdown.Menu>
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
                </ButtonGroup>
                {projects.map((p) => (
                    <Dropdown.Item
                        eventKey={p._id}
                        onClick={() =>
                            setFilter([
                                ...filter.filter((f) => f.filterRubric !== "project"),
                                { filterRubric: "project", filterText: p._id },
                            ])
                        }
                    >
                        {p.project}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}
export function getCategoryHeader({ sort, setSort, categories, filter, setFilter }) {
    return (
        <Dropdown>
            <Dropdown.Toggle className="filter-button w-100" variant="light">
                Kategorie {filterIcon()}
            </Dropdown.Toggle>

            <Dropdown.Menu>
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
                </ButtonGroup>
                {categories.map((c) => (
                    <Dropdown.Item
                        eventKey={c._id}
                        onClick={() =>
                            setFilter([
                                ...filter.filter((f) => f.filterRubric !== "category"),
                                { filterRubric: "category", filterText: c._id },
                            ])
                        }
                    >
                        {c.category}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}
export function getCommentHeader({ sort, setSort }) {
    return (
        <Dropdown>
            <Dropdown.Toggle className="filter-button w-100" variant="light">
                Kommentar {filterIcon()}
            </Dropdown.Toggle>

            <Dropdown.Menu>
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
                </ButtonGroup>
            </Dropdown.Menu>
        </Dropdown>
    );
}
export function getDateHeader({ filter, setFilter, sort, setSort }) {
    return (
        <Dropdown>
            <Dropdown.Toggle className="filter-button w-100" variant="light">
                Datum {filterIcon()}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <FormControl
                    type="date"
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    value={getFilterValue({ identifier: "date", filter })}
                    onChange={(e) =>
                        setFilter([
                            ...filter.filter((f) => f.filterRubric !== "date"),
                            { filterRubric: "date", filterText: e.target.value },
                        ])
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
                </ButtonGroup>
            </Dropdown.Menu>
        </Dropdown>
    );
}
export function getStartHeader({ sort, setSort }) {
    return (
        <Dropdown>
            <Dropdown.Toggle className="filter-button w-100" variant="light">
                Von {filterIcon()}
            </Dropdown.Toggle>

            <Dropdown.Menu>
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
                </ButtonGroup>
            </Dropdown.Menu>
        </Dropdown>
    );
}
export function getEndHeader({ sort, setSort }) {
    return (
        <Dropdown>
            <Dropdown.Toggle className="filter-button w-100" variant="light">
                Bis {filterIcon()}
            </Dropdown.Toggle>

            <Dropdown.Menu>
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
                </ButtonGroup>
            </Dropdown.Menu>
        </Dropdown>
    );
}
export function getDurationHeader() {
    return (
        <Dropdown>
            <Dropdown.Toggle className="filter-button w-100" variant="light">
                Dauer {filterIcon()}
            </Dropdown.Toggle>
        </Dropdown>
    );
}
export function getExternalHeader({ filter, setFilter, sort, setSort }) {
    return (
        <Dropdown as={ButtonGroup} className="w-100">
            <Dropdown.Toggle className="filter-button w-100" variant="light">
                Extern {filterIcon()}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Form>
                    <Form.Check
                        type="checkbox"
                        checked={getFilterValue({ identifier: "external", filter })}
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
                </ButtonGroup>
            </Dropdown.Menu>
        </Dropdown>
    );
}
export function getDownloadHeader({ workentries, csvHeaders }) {
    return (
        <CSVLink
            data={workentries.map((w) => {
                return {
                    ...w,
                    category: w.category ? w.category : {},
                    project: w.project ? w.project : {},
                };
            })}
            headers={csvHeaders}
            filename={"timetracker.csv"}
            target="_blank"
        >
            Download
        </CSVLink>
    );
}
