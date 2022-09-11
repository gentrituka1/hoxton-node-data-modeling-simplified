import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
const db = new Database('./db/setup.db', { verbose: console.log });

app.use(cors());
app.use(express.json());

const port = 4000;

const getAllApplicants = db.prepare(`
    SELECT * FROM applicants;
`)

const getApplicantById = db.prepare(`
    SELECT * FROM applicants WHERE id = @id;
`)

const createNewApplicant = db.prepare(`
    INSERT INTO applicants (name, email) VALUES (@name, @email);
`)


const getAllInterviewers = db.prepare(`
    SELECT * FROM interviewers;
`)

const getInterviewerById = db.prepare(`
    SELECT * FROM interviewers WHERE id = @id;
`)

const createNewInterviewer = db.prepare(`
    INSERT INTO interviewers (name, email) VALUES (@name, @email);
`)


const getInterviewersForApplicant = db.prepare(`
    SELECT interviewers.* FROM interviewers
    JOIN interviews ON interviewers.id = interviews.interviewerId
    WHERE interviews.applicantId = @applicantId;
`)

const getApplicantsForInterviewer = db.prepare(`
    SELECT applicants.* FROM applicants
    JOIN interviews ON applicants.id = interviews.applicantId
    WHERE interviews.interviewerId = @interviewerId;
`)

const getInterviewsForApplicant = db.prepare(`
    SELECT * FROM interviews WHERE applicantId = @applicantId;
`)

const getInterviewsForInterviewer = db.prepare(`
    SELECT * FROM interviews WHERE interviewerId = @interviewerId;
`)

const getAllInterviews = db.prepare(`
    SELECT * FROM interviews;
`)

const getInterviewById = db.prepare(`
    SELECT * FROM interviews WHERE id = @id;
`)

const createNewInterview = db.prepare(`
    INSERT INTO interviews (applicantId, interviewerId, date, score, position, successful) VALUES (@applicantId, @interviewerId, @date, @score, @position, @successful);
`)


const getAllCompanies = db.prepare(`
    SELECT * FROM companies;
`)

const getCompanyById = db.prepare(`
    SELECT * FROM companies WHERE id = @id;
`)

const createNewCompany = db.prepare(`
    INSERT INTO companies (name, city) VALUES (@name, @city);
`)

const getAllEmployees = db.prepare(`
    SELECT * FROM employees;
`)

const getEmployeeById = db.prepare(`
    SELECT * FROM employees WHERE id = @id;
`)

const createNewEmployee = db.prepare(`
    INSERT INTO employees (name, email, position, companyId) VALUES (?, ?, ?, ?);
`)

const deleteEmployee = db.prepare(`
    DELETE FROM employees WHERE id = @id;
`)


// applicants section of API

app.post('/applicants', (req, res) => {
    // Create a new applicant
    const name = req.body.name
    const email = req.body.email

    const errors: string[] = []

    if(typeof name !== 'string'){
        errors.push("The name is not provided or is not a string");
    }
    if(typeof email !== 'string'){
        errors.push("The email is not provided or is not a string");
    }

    if(errors.length === 0){
        const info = createNewApplicant.run(name, email);
        const applicant = getApplicantById.get(info.lastInsertRowid);
        applicant.interviews = getInterviewsForApplicant.all(applicant.id);
        applicant.interviewers = getInterviewersForApplicant.all(applicant.id);
        res.send(applicant);
    } else{
        res.status(400).send({  error: errors   });
    }
})

app.get('/applicants/:id', (req, res) => {
    // - Get details of an applicant, including a list of every interview they've had and who the interviewer was

    const applicant = getApplicantById.get(req.params);

    if(applicant){
        applicant.interviews = getInterviewsForApplicant.all({ applicantId: applicant.id });
        applicant.interviewers = getInterviewersForApplicant.all({ applicantId: applicant.id });
        res.send(applicant);
    } else{
        res.status(400).send("Applicant not found");
    }
})

// intervierwers section of API

app.get('/interviewers/:id', (req, res) => {
    //  - Get details of an interviewer, including a list of every interview they've conducted and who the applicant was

    const interviewer = getInterviewerById.get(req.params);

    if(interviewer){
        interviewer.interviews = getInterviewsForInterviewer.all({interviewerId: interviewer.id});
        interviewer.applicants = getApplicantsForInterviewer.all({interviewerId: interviewer.id});
        res.send(interviewer);
    } else{
        res.status(400).send("Interviewer not found");
    }
})

app.post('/interviewers', (req, res) => {
    // Create a new interviewer
    const name = req.body.name
    const email = req.body.email

    const errors: string[] = []

    if(typeof name !== 'string'){
        errors.push("The name is not provided or is not a string");
    }
    if(typeof email !== 'string'){
        errors.push("The email is not provided or is not a string");
    }

    if(errors.length === 0){
        const info = createNewInterviewer.run(name, email);
        const interviewer = getInterviewerById.get(info.lastInsertRowid);
        interviewer.interviews = getInterviewsForInterviewer.all(interviewer.id);
        interviewer.applicants = getApplicantsForInterviewer.all(interviewer.id);
        res.send(interviewer);
    } else{
        res.status(400).send({  error: errors   });
    }
})

// interviews section of API

app.get('/interviews', (req, res) => {
    // get all interviews, including the applicant and interviewer details

    const interviews = getAllInterviews.all();

    res.send(interviews);
   
})

app.get('/interviews/:id', (req, res) => {
    // get interview by id, including applicant and interviewer details

    const interview = getInterviewById.get(req.params);

    if(interview){
        res.send(interview);
    }
    else{
        res.status(400).send("Interview not found");
    }
})

app.post('/interviews', (req, res) => {
    // Create a new interview and update the interview so it can tell us if it was successful or not
    
    const applicant = getApplicantById.get({id: req.body.applicantId});
    const interviewer = getInterviewerById.get({id: req.body.interviewerId});

    if(req.body.successful === 1){
        createNewEmployee.run({
            name: applicant.name,
            email: applicant.email,
            position: req.body.position,
            companyId: interviewer.companyId
        })
    }
    res.send(
        createNewInterview.run({
            applicantId: req.body.applicantId,
            interviewerId: req.body.interviewerId,
            date: req.body.date,
            score: req.body.score,
            position: req.body.position,
            successful: req.body.successful
        })
    )
})

// company section of API 

app.get('/companies', (req, res) => {
    // get all companies

    const companies = getAllCompanies.all();

    res.send(companies);
})

app.get('/companies/:id', (req, res) => {
    // get company by id

    const company = getCompanyById.get(req.params);

    if(company){
        res.send(company);
    } else{
        res.status(400).send("Company not found");
    }
})

app.post('/companies', (req, res) => {
    // Create a new company
    const name = req.body.name
    const city = req.body.city

    const errors: string[] = []

    if(typeof name !== 'string'){
        errors.push("The name is not provided or is not a string");
    }
    if(typeof city !== 'string'){
        errors.push("The city is not provided or is not a string");
    }

    if(errors.length === 0){
        const info = createNewCompany.run(name, city);
        const company = getCompanyById.get(info.lastInsertRowid);
        res.send(company);
    } else{
        res.status(400).send({  error: errors   });
    }
})

// employees section of API 

app.get('/employees', (req, res) => {
    // get all employees

    const employees = getAllEmployees.all();

    res.send(employees);
})

app.get('/employees/:id', (req, res) => {
    // get employee by id

    const employee = getEmployeeById.get(req.params);

    if(employee){
        res.send(employee);
    } else{
        res.status(400).send("Employee not found");
    }
})

app.post('/employees', (req, res) => {
    // Create a new employee

    const name = req.body.name
    const email = req.body.email
    const position = req.body.position
    const companyId = req.body.companyId

    const errors: string[] = []

    if(typeof name !== 'string'){
        errors.push("The name is not provided or is not a string");
    }
    if(typeof email !== 'string'){
        errors.push("The email is not provided or is not a string");
    }
    if(typeof position !== 'string'){
        errors.push("The position is not provided or is not a string");
    }
    if(typeof companyId !== 'number'){
        errors.push("The companyId is not provided or is not a number");
    }

    if(errors.length === 0){
        const info = createNewEmployee.run(name, email, position, companyId);
        const employee = getEmployeeById.get(info.lastInsertRowid);
        res.send(employee);
    } else{
        res.status(400).send({  error: errors   });
    }
})

app.delete('/employees/:id', (req, res) => {
    // fire employee by id

    const employee = getEmployeeById.get(req.params);

    if(employee){
        deleteEmployee.run(req.params);
        res.send("Employee: " + employee.name + " has been fired");
    } else{
        res.status(400).send("Employee not found!");
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})