import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [count, setCount] = useState(0)
  const [res, setResponse] = useState([])
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('');

  const handleJobDescriptionChange = (event) => {
    setJobDescription(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const fetchAPI  = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/test')
      console.log('Response:', response)
      setResponse(response.data.message)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

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
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <div style={{ padding: '20px' }}>
      <button onClick={fetchAPI}>Generate</button>
      {res && <p>{res}</p>}
    </div>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <form onSubmit={handleSubmit}>
      <div>
          <label className="read-the-docs">
            Job Description:
            <textarea
              value={jobDescription}
              onChange={handleJobDescriptionChange}
              placeholder="Enter the job description here"
              rows="5"
              cols="50"
            />
          </label>
        </div>
        <div>
          <label className="read-the-docs">
            Upload Resume:
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
          </label>
        </div>
      <button type="submit">Upload</button>
    </form>
    </>
  )
}

export default App
