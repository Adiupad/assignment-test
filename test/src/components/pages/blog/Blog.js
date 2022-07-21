import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import blogApi from "../../../api/api";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const Blog = () => {
  let { blogPost } = useParams();

  const [blogData, setBlogData] = useState();
  const [commentData, setCommentData] = useState();

  useEffect(() => {
    const blogDetails = async () => {
      try {
        const res = await blogApi.get(`/posts/${blogPost}`);
        setBlogData(res.data);
      } catch (error) {
        console.log("error by blog api", error);
      }
    };
    blogDetails();
  }, [blogPost]);

  useEffect(() => {
    const commentDetails = async () => {
      try {
        const res = await blogApi.get(`/comments`);
        setCommentData(res.data);
      } catch (error) {
        console.log("error by comment api", error);
      }
    };
    commentDetails();
  }, [blogData]);
  return (
    <>
      <Row xs={1} sm={1} md={2} lg={4} xl={4} xxl={5} className="g-4">
        <Col>
          <Card border="primary" style={{ width: "18rem" }}>
            <Card.Header>{blogData?.userid}</Card.Header>
            <Card.Body>
              <Card.Title>{blogData?.title}</Card.Title>
              <Card.Text>{blogData?.body}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="conatiner">
      <h1>Comments</h1>

        {commentData
          ?.filter((item) => item.postId == blogPost)
          ?.map((filteredList) => {
            return (
              <>
        <div key={filteredList.id.toString()}>
                <p>postid: {filteredList.postId}</p>
                <p>name: {filteredList.name}</p>
                <p>email: {filteredList.email}</p>
                <p>comment: {filteredList.comment}</p>
                <br />
                <br />
        </div>
              </>
            );
          })}
      </div>
    </>
  );
};

export default Blog;
