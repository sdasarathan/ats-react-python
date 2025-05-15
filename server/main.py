from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from openai import OpenAI
from PyPDF2 import PdfReader
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './uploads'
cors = CORS(app)


api_k = os.getenv('API_KEY')

@app.route('/api/generate', methods=['GET'])
def generate():
    
    prompt = "Hello, world!"

    client = OpenAI(api_key=api_k)
    openai_response = client.chat.completions.create(
    model = 'gpt-3.5-turbo',
    messages = [{'role': 'user', 'content': prompt}],
    temperature = 0
    )
    return jsonify({"message": openai_response.choices[0].message.content})

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "Hello, world!"})

@app.route('/api/testUpload', methods=['POST'])
def testUpload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)

    try:
        reader = PdfReader(filepath)
        resumeText = ""
        for page in reader.pages:
            resumeText += page.extract_text()
        
        print(request.form.get('jobDescription'))
        job_description = " Job description: " + request.form.get('jobDescription')
        skillWeightage = openAiChat("Extract skills from this job description and give weightage for each skill in this job description: " + job_description)
        prompt = "Assume you are an HR, rate the following resume from 1 to 10, give feedback based on the required skill weightage \n\n" + skillWeightage + "\n\n Resume: "
        responseFromOpenAi = openAiChat(prompt+ ","+ resumeText +"")
        return jsonify({'text': responseFromOpenAi})
        # return jsonify({'text': "testing api das"})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        os.remove(filepath)

@app.route('/api/matchingSkill', methods=['POST'])
def matchingSkill():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)

    try:
        reader = PdfReader(filepath)
        resumeText = ""
        for page in reader.pages:
            resumeText += page.extract_text()
        
        job_description = " Job description: " + request.form.get('jobDescription')
        skillWeightage = openAiChat("Extract skills from this job description and give weightage for each skill in this job description: " + job_description)
        prompt = "Assume you are an HR, give the matching skills with required weightage \n\n" + skillWeightage + "Output format should be in markdown format.\n\n for the Resume: "
        responseFromOpenAi = openAiChat(prompt+ ","+ resumeText)
        return jsonify({'text': responseFromOpenAi})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        os.remove(filepath)

def openAiChat(prompt):
    client = OpenAI(api_key=api_k)
    openai_response = client.chat.completions.create(
        model='gpt-3.5-turbo',
        messages=[{'role': 'user', 'content': prompt}],
        temperature=0
    )
    return openai_response.choices[0].message.content


if __name__ == '__main__':
    app.run(debug=True, port=8080)