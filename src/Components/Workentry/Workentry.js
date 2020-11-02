import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import moment from "moment";

export default function Workentry({ url }) {
  let [workentries, setWorkentries] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log(`Fetching from ${url}`);
        let workentries = await fetch(url);
        workentries = await workentries.json();
        console.dir(`Successfully fetched, data recieved: ${JSON.stringify(workentries)}`);
        await setWorkentries(workentries.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [url]);

  // console.log(workentries);
  return (
    <Table striped bordered hover variant="dark" size="sm" style={{ tableLayout: "fixed" }}>
      <thead>
        <tr>
          <th>#</th>
          <th>Project</th>
          <th>Category</th>
          <th>Optional</th>
          <th>Start</th>
          <th>End</th>
        </tr>
      </thead>
      <tbody>
        {workentries.map((w) => (
          <tr key={w._id}>
            <td>{w._id.substring(0, 8)}</td>
            <td>{w.project.project}</td>
            <td>{w.category.category}</td>
            <td>{w.optionalText}</td>
            <td>{moment(w.fromDate).format("DD.MM.YYYY hh:mm:ss")}</td>
            <td>{moment(w.untilDate).format("DD.MM.YYYY hh:mm:ss")}</td>
          </tr>
        ))}
      </tbody>
    </Table>
    // <div>
    //     {workentries.map((w) => (
    //         <div key={w.id}>
    //             <p>Project: {w.projectName}</p>
    //             <p>Category: {w.categoryName}</p>
    //             <p>From: {w.fromDate}</p>
    //             <p>Until: {w.untilDate}</p>
    //         </div>
    //     ))}
    // </div>
  );
}
