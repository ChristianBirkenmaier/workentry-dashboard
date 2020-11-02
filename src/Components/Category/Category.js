import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

const CATEGORY_URL = "https://workentry-api.herokuapp.com/api/v1/category";

export default function Category() {
  let [categories, setCategories] = useState([]);
  let [newCategory, setNewCategory] = useState("");
  let [updateCategory, setUpdateCategory] = useState("");
  let [updateId, setUpdateId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      console.log(`Fetching from ${CATEGORY_URL}`);
      let [fetched_categories] = await Promise.all([fetch(CATEGORY_URL)]);
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
      <Table striped bordered hover variant="dark" size="sm" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th>id</th>
            <th>Category</th>
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
                  <>
                    <Button
                      onClick={async () => {
                        let resp = await fetch(`${CATEGORY_URL}/${c._id}`, {
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
                      e
                    </Button>
                    <Button
                      onClick={async () => {
                        setUpdateId(null);
                      }}
                      variant="warning"
                    >
                      x
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={async () => {
                        setUpdateCategory(c.category);
                        setUpdateId(c._id);
                      }}
                      variant="success"
                    >
                      e
                    </Button>
                    <Button
                      onClick={async () => {
                        let resp = await fetch(`${CATEGORY_URL}/${c._id}`, {
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
                      X
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td>-</td>
            <td>
              <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)}></input>
            </td>
            <td>
              <Button
                onClick={async () => {
                  console.log(newCategory);

                  let resp = await fetch(CATEGORY_URL, {
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
      </Table>
    </>
  );
}
