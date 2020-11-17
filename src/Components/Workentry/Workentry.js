import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import moment from "moment";
import { PROD_WORKENTRY_API, DEV_WORKENTRY_API } from "../../config/api.json";
import { Col, Container, Row } from "react-bootstrap";

export default function Workentry() {
  let [workentries, setWorkentries] = useState([]);
  const [workentryUrl, setWorkentryUrl] = useState(process.env.NODE_ENV == "development" ? DEV_WORKENTRY_API : PROD_WORKENTRY_API);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log(`Fetching from ${workentryUrl}`);
        let workentries = await fetch(workentryUrl);
        workentries = await workentries.json();
        console.dir(`Successfully fetched, data recieved: ${workentries}`);
        await setWorkentries(workentries.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  return (
    <Container className="data-container">
      <Row className="data-header align-items-center">
        <Col sm={1}>ID</Col>
        <Col sm={2}>Kategorie</Col>
        <Col sm={2}>Projekt</Col>
        <Col sm={4}>Kommentar</Col>
        <Col sm={1}>Von</Col>
        <Col sm={1}>Bis</Col>
        <Col sm={1}></Col>
      </Row>
      {workentries.map((w) => (
        <Row key={w._id} className="align-items-center">
          <Col sm={2}>{w._id.substring(0, 8)}...</Col>
          <Col sm={2}>{w.project ? w.project.project : "Unbekanntes Projekt"}</Col>
          <Col sm={2}>{w.category ? w.category.category : "Unbekannte Kategorie"}</Col>
          <Col sm={4}>{w.optionalText}</Col>
          <Col sm={1}>{w.fromDate}</Col>
          <Col sm={1}>{w.untilDate}</Col>
          <Col sm={1}>X</Col>
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
