// src/components/UserList.js
import React, { useEffect, useState } from "react";
import orders from "../data.json";
import "../index.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Button, Card, Row, Col, Badge } from "react-bootstrap";
import { AiOutlinePrinter } from "react-icons/ai";
import { SlMagnifier } from "react-icons/sl";
import { BsCheck2 } from "react-icons/bs";
import { GoCheck } from "react-icons/go";
import { RxCross1 } from "react-icons/rx";
import { TfiShoppingCart } from "react-icons/tfi";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, updateProductStatus } from "../slices/counterSlice";
import Modal from "react-bootstrap/Modal";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const orderData = useSelector((state) => state.counter.orderData);
  const [loading, setLoading] = useState(true);
  const [smShow, setSmShow] = useState(false);
  const [prodId, setProdId] = useState();
  const [prodName, setProdName] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalOrder, setTotalOrder] = useState();

  useEffect(() => {
    dispatch(getOrderDetails(1)).then((res) => {
      setLoading(!loading);
    });
  }, []);

  useEffect(() => {
    let total = 0;
    if (Object.keys(orderData).length > 0) {
      orderData.products.map((item) => {
        let p = item.quantity * item.price;
        total += p;
      });
    }
    setTotalOrder(total);
  }, [orderData.products]);

  useEffect(() => {
    if (Object.keys(orderData).length > 0) {
      const filtered = orderData.products.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchValue, orderData.products]);

  const approve = (itemId, value) => {
    const payload = {
      // orderId: orderData.id,
      productId: itemId,
      newStatus: value,
    };
    dispatch(updateProductStatus(payload));
    if (smShow) {
      setSmShow(!smShow);
    }
  };

  const openModel = (product) => {
    setProdName(product.name);
    setProdId(product.id);
    setSmShow(true);
  };

  const statusButton = (value) => {
    return (
      <>
        {value.length ? (
          <Badge
            className={`rounded-pill bd-status ${
              value === "Approved"
                ? "custom-success"
                : value === "Missing"
                ? "custom-missing"
                : "custom-urgent"
            }`}
          >
            {value}
          </Badge>
        ) : (
          <></>
        )}
      </>
    );
  };

  const dateFomat = (value) => {
    const date = new Date(value);
    const options = { weekday: "short", month: "short", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  };

  // console.log(orderData, "---setOrderData", orderId);
  return (
    <>
      <header className="shadow pb-3 sticky">
        <Navbar expand="lg" className="bg-success text-white">
          <Container>
            <Navbar.Brand className="text-white" href="#home">
              Reeco
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <div className="me-auto d-flex gap-5">
                <Nav.Link href="#home">Store</Nav.Link>
                <Nav.Link href="#link">Orders</Nav.Link>
                <Nav.Link href="#link">Analytics</Nav.Link>
              </div>
              <div className="d-flex gap-5">
                <Nav.Link
                  href="#link"
                  style={{ position: "relative", display: "inline-block" }}
                >
                  <TfiShoppingCart className="fs-4" />
                  <div className="dot-class"
                    style={{
                      position: "absolute",
                      top: "-4px",
                      right: "14px", 
                      background: "lightgreen", 
                      color: "white",
                      borderRadius: "50%",
                      width: "15px",
                      height: "15px",
                      textAlign: "center",
                      lineHeight: "15px",
                      fontSize: "10px", 
                    }}
                  >
                    9
                  </div>
                </Nav.Link>
                <NavDropdown title="Hello, James" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">
                    Addresses
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">
                    Cart
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container>
          <Breadcrumb>
            <Breadcrumb.Item href="#">Orders</Breadcrumb.Item>
            <Breadcrumb.Item href="" className="active">
              Order12345
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="m-0">Order 12345</h4>
            <div className="d-flex gap-2">
              <Button variant="outline-success" className="rounded-pill">
                Back
              </Button>
              <Button variant="success" className="rounded-pill">
                Approve Order
              </Button>
            </div>
          </div>
        </Container>
      </header>

      <section className="py-4">
        <Container>
          {orderData && (
            <Card className="mb-3">
              <Card.Body>
                {
                  <Row>
                    <Col xs={2} className="text-data">
                      <h6>Supplier</h6>
                      <h5>{orderData.supplier}</h5>
                    </Col>
                    <Col xs={2} className="text-data">
                      <h6>Shipping date</h6>
                      <h5>{dateFomat(orderData.shipping_date)}</h5>
                    </Col>
                    <Col xs={2} className="text-data">
                      <h6>Total</h6>
                      <h5>{totalOrder}</h5>
                    </Col>
                    <Col xs={2} className="text-data">
                      <h6>Category</h6>
                      <h5>{orderData.category}</h5>
                    </Col>
                    <Col xs={2} className="text-data">
                      <h6>Department</h6>
                      <h5>{orderData.department}</h5>
                    </Col>
                    <Col xs={2} className="text-data-last">
                      <h6>Status</h6>
                      <h5>{orderData.status}</h5>
                    </Col>
                  </Row>
                }
              </Card.Body>
            </Card>
          )}
          <Card>
            <Card.Body>
              <Row className="justify-content-between">
                <Col xs={6}>
                  <div className="search-bar">
                    <input
                      type="search"
                      className="w-100"
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <span>
                      <SlMagnifier />
                    </span>
                  </div>
                </Col>
                <Col xs={3}>
                  <div className="d-flex justify-content-end">
                    <Button variant="outline-success" className="rounded-pill">
                      Add Item
                    </Button>
                    <AiOutlinePrinter className="ms-3 fs-3 text-success" />
                  </div>
                </Col>
              </Row>
              <div className="table-responsive mt-3">
                <table className="table">
                  <thead className="table-head">
                    <tr>
                      <th></th>
                      <th>Product Name</th>
                      <th>Brand</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className="table-data">
                    {filteredProducts.length > 0 && !loading ? (
                      filteredProducts.map((item, index) => {
                        return (
                          <tr>
                            <td>
                              <img src="Avocado.jpg" className="prod-avt" />
                            </td>
                            <td>{item.name}</td>
                            <td>{item.brand}</td>
                            <td>${item.price}</td>
                            <td>{item.quantity}</td>
                            <td>${item.price * item.quantity}</td>
                            <td>{statusButton(item.status)}</td>
                            <td>
                              <div>
                                {item.status === "Approved" ? (
                                  <FaCheck className="me-3 action action-success fs-5" />
                                ) : (
                                  <GoCheck
                                    className="me-3 action"
                                    onClick={() => approve(item.id, "Approved")}
                                  />
                                )}
                                {item.status === "Missing" ||
                                item.status === "Missing - Urgent" ? (
                                  <IoClose className="me-3 action action-fail fs-5" />
                                ) : (
                                  <RxCross1
                                    className="me-3 action"
                                    onClick={() => openModel(item)}
                                  />
                                )}
                                <span className="me-3 action">Edit</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td>Loading</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </section>

      <Modal
        size="sm"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm" className="fs-6">
            Missing Product
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Is {prodName} urgent ?</Modal.Body>
        <Modal.Footer>
          <Button variant="none" onClick={() => approve(prodId, "Missing")}>
            No
          </Button>
          <Button
            variant="none"
            onClick={() => approve(prodId, "Missing - Urgent")}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderDetails;
