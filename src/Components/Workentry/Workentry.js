import React, { useState, useEffect } from "react";
import { PROD_WORKENTRY_API, DEV_WORKENTRY_API } from "../../config/api.json";
import { Col, Container, Row, Button, FormControl, InputGroup } from "react-bootstrap";
import sortList from "../../helpers";
import { BsFillTrashFill } from "react-icons/bs";

export default function Workentry({ isDev }) {
  let [workentries, setWorkentries] = useState([]);
  let [filteredWorkentries, setFilteredWorkentries] = useState([]);
  const [workentryUrl, setWorkentryUrl] = useState(isDev ? DEV_WORKENTRY_API : PROD_WORKENTRY_API);
  let [filter, setFilter] = useState({ filterRubric: null, filterText: null });

  let [sort, setSort] = useState({ name: "category.category", asc: false });

  async function fetchData() {
    try {
      console.log(`Fetching from ${workentryUrl}`);
      let workentries = await fetch(workentryUrl);
      workentries = await workentries.json();
      console.dir(`Successfully fetched, data recieved: ${JSON.stringify(workentries)}`);
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

  return (
    <Container fluid className="data-container">
      <Row className="data-header align-items-center">
        <Col
          onClick={() => {
            setSort({ name: "_id", asc: sort.asc ? !sort.asc : true });
          }}
          sm={1}
        >
          ID {sort.name === "_id" ? sort.asc ? <span>▲</span> : <span>▼</span> : <span>▵</span>}
        </Col>
        <Col
          onClick={() => {
            setSort({ name: "project.project", asc: sort.asc ? !sort.asc : true });
          }}
          sm={2}
        >
          Projekt {sort.name === "project.project" ? sort.asc ? <span>▲</span> : <span>▼</span> : <span>▵</span>}
        </Col>
        <Col
          onClick={() => {
            setSort({ name: "category.category", asc: sort.asc ? !sort.asc : true });
          }}
          sm={2}
        >
          Kategorie {sort.name === "category.category" ? sort.asc ? <span>▲</span> : <span>▼</span> : <span>▵</span>}
        </Col>
        <Col
          onClick={() => {
            setSort({ name: "optionalText", asc: sort.asc ? !sort.asc : true });
          }}
          sm={4}
        >
          Kommentar {sort.name === "optionalText" ? sort.asc ? <span>▲</span> : <span>▼</span> : <span>▵</span>}
        </Col>
        <Col sm={1}>Von - Bis</Col>
        <Col sm={1}>Dauer</Col>
        <Col sm={1}></Col>
      </Row>
      <Row>
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
      </Row>
      {filteredWorkentries.map((w) => (
        <Row key={w._id} className="align-items-center">
          <Col sm={1}>{w._id.substring(0, 8)}...</Col>
          <Col sm={2}>{w.project ? w.project.project : "Unbekanntes Projekt"}</Col>
          <Col sm={2}>{w.category ? w.category.category : "Unbekannte Kategorie"}</Col>
          <Col sm={4}>{w.optionalText}</Col>
          <Col sm={1}>
            {w.fromDate} - {w.untilDate}
          </Col>
          <Col sm={1}> {calculateDuration(w.fromDate, w.untilDate)}</Col>
          <Col sm={1}>
            <Button variant="danger" size="sm" onClick={() => handleDelete(w._id)}>
              <BsFillTrashFill />
            </Button>
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
