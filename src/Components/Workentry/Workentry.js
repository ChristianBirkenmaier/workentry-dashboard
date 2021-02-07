import React, { useState, useEffect } from "react";
import {
    PROD_WORKENTRY_API,
    DEV_WORKENTRY_API,
    PROD_PROJECT_API,
    DEV_PROJECT_API,
    PROD_CATEGORY_API,
    DEV_CATEGORY_API,
} from "../../config/api.json";
import { Col, Container, Row, Button, FormControl, InputGroup, Dropdown, ButtonGroup, Form } from "react-bootstrap";
import sortList from "../../helpers";
import { BsFillTrashFill, BsGear, BsFillBookmarkFill, BsFillXCircleFill } from "react-icons/bs";
import moment from "moment";
import { checkIcon } from "../../assets/icons";
import {
    fetchData,
    showActiveFilters,
    handleUpdate,
    handleDelete,
    getCategoryHeader,
    getCommentHeader,
    getDateHeader,
    getDownloadHeader,
    getDurationHeader,
    getEndHeader,
    getExternalHeader,
    getProjectHeader,
    getStartHeader,
} from "./functions/Workentry";

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
const DEV_URLS = { workentryUrl: DEV_WORKENTRY_API, categoryUrl: DEV_CATEGORY_API, projectUrl: DEV_PROJECT_API };
const PROD_URLS = {
    workentryUrl: PROD_WORKENTRY_API,
    categoryUrl: PROD_CATEGORY_API,
    projectUrl: PROD_PROJECT_API,
};

export default function Workentry({ isDev }) {
    let [workentries, setWorkentries] = useState([]);
    let [categories, setCategories] = useState([]);
    let [projects, setProjects] = useState([]);
    let [filter, setFilter] = useState([{ filterRubric: "date", filterText: moment().format("YYYY-MM-DD") }]);
    let [updateData, setUpdateData] = useState(null);
    let [count, setCount] = useState(0);
    let [skip, setSkip] = useState(0);
    let [limit, setLimit] = useState(0);
    const [urls, setUrls] = useState(isDev ? DEV_URLS : PROD_URLS);
    let [sort, setSort] = useState({ name: "category.category", asc: false });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(async () => {
        await loadData();
    }, [filter]);
    useEffect(() => {
        console.log("[sort]", sort);
        setWorkentries(sortList(sort, workentries));
    }, [sort]);

    useEffect(() => {
        setUrls(isDev ? { ...DEV_URLS } : { ...PROD_URLS });
    }, [isDev]);

    useEffect(() => {
        loadData();
    }, [urls]);

    useEffect(() => console.log("Count", count), [count]);

    async function loadData() {
        setIsLoading(true);
    }

    useEffect(() => {
        console.log("useEffect isLoading");
        if (isLoading) {
            console.log("inside useEffectisloading if true");
            fetchData({ filter, urls, limit, skip, setCategories, setProjects, setWorkentries, setIsLoading });
        }
    }, [isLoading]);

    return (
        <Container fluid className="data-container">
            <Row>
                <Col className="d-flex align-items-center">
                    {showActiveFilters({ filter, setFilter, projects, categories })}
                </Col>
            </Row>
            <Row className="data-header align-items-center">
                <Col className="list-header-row" sm={2}>
                    {getProjectHeader({ sort, setSort, projects, filter, setFilter })}
                </Col>
                <Col className="list-header-row" sm={2}>
                    {getCategoryHeader({ sort, setSort, categories, filter, setFilter })}
                </Col>
                <Col className="list-header-row" sm={2}>
                    {getCommentHeader({ sort, setSort })}
                </Col>
                <Col className="list-header-row" sm={1}>
                    {getDateHeader({ filter, setFilter, sort, setSort })}
                </Col>
                <Col className="list-header-row" sm={1}>
                    {getStartHeader({ sort, setSort })}
                </Col>
                <Col className="list-header-row" sm={1}>
                    {getEndHeader({ sort, setSort })}
                </Col>
                <Col className="list-header-row" sm={1}>
                    {getDurationHeader()}
                </Col>
                <Col className="list-header-row" sm={1}>
                    {getExternalHeader({ filter, setFilter, sort, setSort })}
                </Col>
                <Col className="list-header-row" sm={1}>
                    {getDownloadHeader({ workentries, csvHeaders })}
                </Col>
            </Row>
            {isLoading ? (
                <div>Loading ...</div>
            ) : workentries.length ? (
                workentries.map((w) => (
                    <Row key={w._id} className="align-items-center data-row">
                        <Col sm={2} className={!!updateData && w._id === updateData._id ? "p-0" : ""}>
                            {!!updateData && w._id === updateData._id ? (
                                <Dropdown>
                                    <Dropdown.Toggle className="filter-button w-100" variant="light">
                                        {updateData?.project?.project || ""}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {projects.map((p) => (
                                            <Dropdown.Item
                                                eventKey={p._id}
                                                onClick={() =>
                                                    setUpdateData({
                                                        ...updateData,
                                                        project: { _id: p._id, project: p.project },
                                                    })
                                                }
                                            >
                                                {p.project}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : w.project ? (
                                w.project?.project
                            ) : (
                                "Unbekanntes Projekt"
                            )}
                        </Col>
                        <Col sm={2} className={!!updateData && w._id === updateData._id ? "p-0" : ""}>
                            {!!updateData && w._id === updateData._id ? (
                                <Dropdown>
                                    <Dropdown.Toggle variant="light" className="filter-button w-100">
                                        {updateData?.category?.category || ""}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {categories.map((c) => (
                                            <Dropdown.Item
                                                eventKey={c._id}
                                                onClick={() =>
                                                    setUpdateData({
                                                        ...updateData,
                                                        category: { _id: c._id, category: c.category },
                                                    })
                                                }
                                            >
                                                {c.category}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : w.category ? (
                                w?.category?.category
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
                                        value={
                                            updateData.start
                                                ? updateData.start
                                                : updateData.fromDate
                                                ? updateData.fromDate
                                                : ""
                                        }
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
                                        value={
                                            updateData.end
                                                ? updateData.end
                                                : updateData.untilDate
                                                ? updateData.untilDate
                                                : ""
                                        }
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
                                    <FormControl type="text" disabled value={w.duration}></FormControl>
                                </InputGroup>
                            ) : (
                                w.duration || "Keine Dauer verfügbar"
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
                            ) : w.external ? (
                                checkIcon()
                            ) : (
                                ""
                            )}
                        </Col>
                        <Col sm={1}>
                            {!!updateData && w._id === updateData._id ? (
                                <ButtonGroup>
                                    <Button
                                        onClick={() => handleUpdate({ updateData, setUpdateData, urls, loadData })}
                                        variant="primary"
                                    >
                                        <BsFillBookmarkFill />
                                    </Button>
                                    <Button onClick={() => setUpdateData(null)} variant="warning">
                                        <BsFillXCircleFill />
                                    </Button>
                                </ButtonGroup>
                            ) : (
                                <ButtonGroup>
                                    <Button onClick={() => setUpdateData({ ...w })} variant="dark">
                                        <BsGear />
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete({ id: w._id, urls, loadData })}
                                        variant="danger"
                                    >
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
