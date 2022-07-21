import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import blogApi from "../../../api/api";

const Comments = () => {
  var { blogPost } = useParams();

  const [blogData, setBlogData] = useState([]);

  useEffect(() => {
    const blogDetails = async () => {
      try {
        const res = await blogApi.get(`/posts/${blogPost}`);
        setBlogData(res.data);
      } catch (error) {
        console.log("error by api", error);
      }
    };
    blogDetails();
  }, [blogPost]);

  console.log(blogData)
  return <div>Comments</div>;
};

export default Comments;
