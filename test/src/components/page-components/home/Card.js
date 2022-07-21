import React, { useEffect, useState } from "react";
import cardApi from "../../../api/api";
import Card from "react-bootstrap/Card";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";

const Cards = () => {
  const [postData, setPostData] = useState([]);
  useEffect(() => {
    const cardDetails = async () => {
      try {
        const res = await cardApi.get(`/posts/`);
        setPostData(res.data);
      } catch (error) {
        console.log("error by api", error);
      }
    };
    cardDetails();
  }, []);

  return (
    <>
    <Row xs={1} sm={1} md={2} lg={4} xl={4} xxl={5} className="g-4">
      {postData?.map((item, index) => {
        return (
          <>
            <div key={item.id.toString()} className="card-outline">
            <Col>
              <Card border="primary" style={{ width: "18rem" }}>
                <Card.Header>{item.userid}</Card.Header>
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>{item.body}</Card.Text>
                </Card.Body>
                {/* <Button variant="primary">Primary</Button> */}
                <Link to={`blog/${item.id}`}>
                <Button >more</Button>
                </Link>
              </Card>
              </Col>
            </div>
          </>
        );
      })}
      </Row>
    </>
  );
};
export default Cards;
