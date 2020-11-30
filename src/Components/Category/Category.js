import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { PROD_CATEGORY_API, DEV_CATEGORY_API } from "../../config/api.json";
import sortList from "../../helpers";
import { BsFillTrashFill, BsGear, BsFillBookmarkFill, BsFillXCircleFill } from "react-icons/bs";

export default function Category({ isDev }) {
  let [categories, setCategories] = useState([]);
  let [newCategory, setNewCategory] = useState("");
  let [updateCategory, setUpdateCategory] = useState("");
  let [updateId, setUpdateId] = useState(null);
  const [categoryUrl, setCategoryUrl] = useState(isDev ? DEV_CATEGORY_API : PROD_CATEGORY_API);
  let [sort, setSort] = useState({ name: "category", asc: false });

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    setCategoryUrl(isDev ? DEV_CATEGORY_API : PROD_CATEGORY_API);
  }, [isDev]);

  useEffect(() => {
    console.log("useEffect sort");
    setCategories(sortList(sort, categories));
  }, [sort]);

  useEffect(() => {
    fetchData();
  }, [categoryUrl]);

  async function fetchData() {
    try {
      console.log(`Fetching from ${categoryUrl}`);
      let [fetched_categories] = await Promise.all([fetch(categoryUrl)]);
      fetched_categories = await fetched_categories.json();
      console.dir(`Successfully fetched, data recieved: ${JSON.stringify(fetched_categories)}`);
      if (fetched_categories.ok) {
        setCategories(sortList(sort, fetched_categories.data));
      } else {
        throw new Error("Error while fetching categories");
      }
    } catch (err) {
      console.error(err);
      setCategories([]);
    }
  }

  return (
    <>
      <Container fluid className="data-container">
        <Row className="data-header align-items-center">
          {/* <Col
            sm={4}
            onClick={() => {
              setSort({ name: "_id", asc: sort.asc ? !sort.asc : true });
            }}
          >
            ID {sort.name === "_id" ? sort.asc ? <span>▲</span> : <span>▼</span> : <span>▵</span>}
          </Col> */}
          <Col
            sm={4}
            onClick={() => {
              setSort({ name: "category", asc: sort.asc ? !sort.asc : true });
            }}
          >
            Kategoriename {sort.name === "category" ? sort.asc ? <span>▲</span> : <span>▼</span> : <span>▵</span>}
          </Col>
          <Col sm={4}></Col>
        </Row>
        {categories.map((c) => (
          <Row key={c._id} className="align-items-center">
            {/* <Col sm={4}>{c._id}</Col> */}
            <Col sm={4}>{c._id === updateId ? <input onChange={(e) => setUpdateCategory(e.target.value)} value={updateCategory}></input> : c.category}</Col>
            <Col sm={4}>
              {c._id === updateId ? (
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
                  <BsFillBookmarkFill />
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
                    <BsGear />
                  </Button>
                </>
              )}
              {c._id === updateId ? (
                <Button
                  size="sm"
                  onClick={async () => {
                    setUpdateId(null);
                  }}
                  variant="warning"
                >
                  <BsFillXCircleFill />
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
                  <BsFillTrashFill />
                </Button>
              )}
            </Col>
          </Row>
        ))}
        <Row className="align-items-center">
          <Col sm={4} style={{ fontWeight: "bold" }}>
            Neue Kategorie
          </Col>
          <Col sm={4}>
            <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)}></input>
          </Col>
          <Col sm={4}>
            <Button
              size="sm"
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
              <BsFillBookmarkFill />
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}
