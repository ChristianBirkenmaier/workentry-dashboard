import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import { PROD_CATEGORY_API, DEV_CATEGORY_API } from "../../config/api.json";

export default function Category() {
  let [categories, setCategories] = useState([]);
  let [newCategory, setNewCategory] = useState("");
  let [updateCategory, setUpdateCategory] = useState("");
  let [updateId, setUpdateId] = useState(null);
  const [categoryUrl, setCategoryUrl] = useState(process.env.NODE_ENV == "development" ? DEV_CATEGORY_API : PROD_CATEGORY_API);
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      console.log(`Fetching from ${categoryUrl}`);
      let [fetched_categories] = await Promise.all([fetch(categoryUrl)]);
      fetched_categories = await fetched_categories.json();
      console.dir(`Successfully fetched, data recieved: ${JSON.stringify(fetched_categories)}`);
      if (fetched_categories.ok) {
        await setCategories(fetched_categories.data);
      } else {
        throw new Error("Error while fetching categories");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <Container className="data-container">
        <Row className="data-header align-items-center">
          <Col sm={3}>ID</Col>
          <Col sm={4}>Kategoriename</Col>
          <Col sm={2}></Col>
          <Col sm={2}></Col>
          <Col sm={1}></Col>
        </Row>
        {categories.map((c) => (
          <Row key={c._id} className="align-items-center">
            <Col sm={3}>{c._id}</Col>
            <Col sm={4}>{c._id == updateId ? <input onChange={(e) => setUpdateCategory(e.target.value)} value={updateCategory}></input> : c.category}</Col>
            <Col sm={2}>
              {c._id == updateId ? (
                <Button
                  size="sm"
                  onClick={async () => {
                    let resp = await fetch(`${categoryUrl}/${c._id}`, {
                      method: "put",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        id: c._id,
                        category: updateCategory,
                      }),
                    });
                    console.log(resp);
                    resp = await resp.text();
                    console.log("Updated successfully", resp);
                    fetchData();
                    setUpdateId(null);
                  }}
                  variant="primary"
                >
                  Speichern
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    onClick={async () => {
                      setUpdateCategory(c.category);
                      setUpdateId(c._id);
                    }}
                    variant="dark"
                  >
                    Ändern
                  </Button>
                </>
              )}
            </Col>
            <Col sm={2}>
              {c._id == updateId ? (
                <Button
                  size="sm"
                  onClick={async () => {
                    setUpdateId(null);
                  }}
                  variant="warning"
                >
                  Abbrechen
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={async () => {
                    let resp = await fetch(`${categoryUrl}/${c._id}`, {
                      method: "delete",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        id: c._id,
                      }),
                    });
                    console.log(resp);
                    resp = await resp.text();
                    console.log("Deleted successfully", resp);
                    fetchData();
                  }}
                  variant="danger"
                >
                  Löschen
                </Button>
              )}
            </Col>
            <Col sm={1}></Col>
          </Row>
        ))}
        <Row className="align-items-center">
          <Col sm={3} style={{ fontWeight: "bold" }}>
            Neue Kategorie
          </Col>
          <Col sm={4}>
            <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)}></input>
          </Col>
          <Col sm={2}></Col>

          <Col sm={2}>
            <Button
              size="sm"
              block
              onClick={async () => {
                console.log(newCategory);

                let resp = await fetch(categoryUrl, {
                  method: "post",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    category: newCategory,
                  }),
                });
                console.log(resp);
                resp = await resp.text();
                console.log("Posted successfully", resp);

                // posting
                setNewCategory("");
                fetchData();
              }}
              variant="primary"
            >
              Add
            </Button>
          </Col>
        </Row>
      </Container>
      {/* <Table striped bordered hover variant="light" size="sm" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th>id</th>
            <th>Category</th>
            <th>#</th>
            <th>#</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c._id}>
              <td>{c._id.substring(0, 8)}</td>
              <td>{c._id == updateId ? <input onChange={(e) => setUpdateCategory(e.target.value)} value={updateCategory}></input> : c.category}</td>
              <td>
                {c._id == updateId ? (
                  <Button
                    block
                    onClick={async () => {
                      let resp = await fetch(`${categoryUrl}/${c._id}`, {
                        method: "put",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          id: c._id,
                          category: updateCategory,
                        }),
                      });
                      console.log(resp);
                      resp = await resp.text();
                      console.log("Updated successfully", resp);
                      fetchData();
                      setUpdateId(null);
                    }}
                    variant="primary"
                  >
                    Speichern
                  </Button>
                ) : (
                  <>
                    <Button
                      block
                      onClick={async () => {
                        setUpdateCategory(c.category);
                        setUpdateId(c._id);
                      }}
                      variant="dark"
                    >
                      Ändern
                    </Button>
                  </>
                )}
              </td>
              <td>
                {c._id == updateId ? (
                  <Button
                    block
                    onClick={async () => {
                      setUpdateId(null);
                    }}
                    variant="warning"
                  >
                    Abbrechen
                  </Button>
                ) : (
                  <Button
                    block
                    onClick={async () => {
                      let resp = await fetch(`${categoryUrl}/${c._id}`, {
                        method: "delete",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          id: c._id,
                        }),
                      });
                      console.log(resp);
                      resp = await resp.text();
                      console.log("Deleted successfully", resp);
                      fetchData();
                    }}
                    variant="danger"
                  >
                    Löschen
                  </Button>
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td>-</td>
            <td>
              <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)}></input>
            </td>
            <td colSpan="2">
              <Button
                onClick={async () => {
                  console.log(newCategory);

                  let resp = await fetch(categoryUrl, {
                    method: "post",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      category: newCategory,
                    }),
                  });
                  console.log(resp);
                  resp = await resp.text();
                  console.log("Posted successfully", resp);

                  // posting
                  setNewCategory("");
                  fetchData();
                }}
                variant="primary"
              >
                Add
              </Button>
            </td>
          </tr>
        </tbody>
      </Table> */}
    </>
  );
}
