import { useState } from "react";
import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import "./newcourse.scss";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import useFetch from "../../../hooks/useFetch";

const NewCourse = ({title}) => {

  const { data } = useFetch(`/courses/get/codes`);

  const [info, setInfo] = useState({
    name: "",
    code: "",
    header: "",
    credits: "",
    description: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
      setInfo((prev) => ({...prev, [e.target.id]: e.target.value}));
  }

  const handleClick = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { name, code, header, credits, description } = info;

    if (!name.trim() || !code.trim() || !header.trim()  || !description.trim()) {
      toast.error("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }
    if (isNaN(credits) || credits < 0 || credits > 5) {
      toast.error("Credits must be a number between 0 and 5");
      setIsSubmitting(false);
      return;
    }
    if (data.includes(code)) {
      console.log(data);
      toast.error("Course ID already exists.");
      setIsSubmitting(false);
      return;
    }

    try{
      await axios.post("/courses", info);
      toast.success("Course added successfully");
    }catch(err){
      console.log(err);
      toast.error("Failed to add course. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="newcourse">
         <Toaster
          position="bottom-right" 
          toastOptions={{ 
            style: { 
              minWidth: '400px',
              padding: '25px', // Adjust padding as needed
              background: '#fcf5f3'
            } 
          }} 
        />
        <Sidebar />
        <div className="right">
            <Navbar />
            <h1 className="title">{title}</h1>
            <div className="form-container">
              <form >
                <div className="formInput">
                  <label>Course Name</label>
                  <input type="text" placeholder="Introduction to Computer Science" id="name" onChange={handleChange}/>
                </div>
                <div className="formInput">
                  <label>Course ID</label>
                  <input type="text" placeholder="CS101" id="code" onChange={handleChange}/>
                </div>
                <div className="formInput">
                  <label>Headline</label>
                  <input type="text" placeholder="Learn the Fundamentals of Programming" id="header" onChange={handleChange}/>
                </div>
                <div className="formInput">
                  <label>Credits</label>
                  <input type="number" placeholder="Course Credits" id="credits" onChange={handleChange}/>
                </div>
                <div className="formInput">
                  <label>Description</label>
                  <textarea placeholder="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Inventore, quae." id="description" onChange={handleChange}/>
                </div>
               
               
              </form>
              <div className="bottom">
                 <button disabled={isSubmitting} onClick={handleClick} className="btn">Submit</button>
              </div>
            </div>   
        </div>
    </div>
  )
}

export default NewCourse;
