import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import atsLogo from './assets/ats-logo.png'; 

function App() {
  const [res, setResponse] = useState([])
  const [matchingSkill, setMatchingSkill] = useState([])
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('');

  const handleJobDescriptionChange = (event) => {
    setJobDescription(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a PDF file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await axios.post('http://localhost:8080/api/testUpload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      console.log("Extracted Text:", response.data);
      setResponse(response.data.text)

      const matchingSkillResponse = await axios.post('http://localhost:8080/api/matchingSkill', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      console.log("Matching Skills:", matchingSkillResponse.data);
      setMatchingSkill(matchingSkillResponse.data.text)
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <>
      <div className="logos">
        <a href="/" target="_blank">
          <img src={atsLogo} className="logo" alt="ATS logo" />
        </a>
      </div>
      <h1>ATS Resume Checker</h1>    
      <form onSubmit={handleSubmit}>
      <div className="card" style={{ padding: '20px', maxWidth: '500px', margin: 'auto'}}>
          <label>
            Job Description:
          </label>
          <textarea
              value={jobDescription}
              onChange={handleJobDescriptionChange}
              placeholder="Enter the job description here please"
              rows="5"
              cols="50"
            />
        </div>
        <div className="card" style={{ padding: '20px', maxWidth: '500px', margin: 'auto'}}>
          <label className="card">
            Upload Resume:
          </label>
          <input style={{ padding: '20px', maxWidth: '500px', margin: 'auto'}} type="file" accept="application/pdf" onChange={handleFileChange} />
        </div>

        <button type="submit">Get feedback</button>

      <div className="card" style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
        <label>
        Matching skills:
        </label>
        <p>
            {matchingSkill}
          </p>
      </div>
      

      <div className="card" style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
        <label>
        Over all feedback:
        </label>
          <p>
            {res}
          </p>
      </div>
    </form>
    </>
  )
}

export default App
