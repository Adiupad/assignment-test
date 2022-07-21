import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import blogApi from "../../../api/api";
import Card from "react-bootstrap/Card";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


const Blog = () => {
  var { blogPost } = useParams();

  const [blogData, setBlogData] = useState();

  useEffect(() => {
    const blogDetails = async () => {
      try {
        const res = await blogApi.get(`/posts/${blogPost}`);
        // console.log( "data from api",res.data)
        let appendData = [];
        appendData.push(res.data)
        setBlogData(appendData);
      } catch (error) {
        console.log("error by api", error);
      }
    };
    blogDetails();
  }, [blogPost]);

  console.log(blogData)
  return (
   <>
       <Row xs={1} sm={1} md={2} lg={4} xl={4} xxl={5} className="g-4">
      {blogData?.map((item, index) => {
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
              </Card>
              </Col>
            </div>
          </>
        );
      })}
      </Row></>
  )
}

export default Blog