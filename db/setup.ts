import Database from "better-sqlite3";

const db = new Database('./db/setup.db', { verbose: console.log });

function everythingApplicants(){

    const applicants = [
        {
            name: "Gentrit Uka",
            email: "gentrit@gmail.com",
        },
        {
            name: "Reymond Reddington",
            email: "reddington@gmail.com"
        },
        {
            name: "Elisabeth Keen",
            email: "elisabeth@gmail.com"
        }
    ]

const dropApplicantsTable = db.prepare(`
    DROP TABLE IF EXISTS applicants;
`)
dropApplicantsTable.run();

const createApplicantsTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS applicants (
        id INTEGER NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        PRIMARY KEY (id)
    );
`)
createApplicantsTable.run();



const createNewApplicant = db.prepare(`
    INSERT INTO applicants (name, email) VALUES (@name, @email);
`)

for(let applicant of applicants){
    createNewApplicant.run(applicant);
}
}



function everythingInterviewers(){
    
        const interviewers = [
            {
                name: "Donald Resler",
                email: "donald@gmail.com",
            },
            {
                name: "Tom Keen",
                email: "tom@gmail.com",
            },
            {
                name: "Katarina Rostova",
                email: "katarina@gmail.com",
            }
        ]

    const dropInterviewersTable = db.prepare(`
        DROP TABLE IF EXISTS interviewers;
    `)
    dropInterviewersTable.run();

    const createInterviewersTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS interviewers (
            id INTEGER NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            PRIMARY KEY (id)
        );
    `)
    createInterviewersTable.run();

    const createNewInterviewer = db.prepare(`
        INSERT INTO interviewers (name, email) VALUES (@name, @email);
    `)

    for(let interviewer of interviewers){
        createNewInterviewer.run(interviewer);
    }
}



function everythingInterviews(){
        
            const interviews = [
                {
                    applicantId: 1,
                    interviewerId: 1,
                    date: "2021-01-01",
                    score: 5,
                    position: "Software Engineer",
                    successful: 1
                },
                {
                    applicantId: 1,
                    interviewerId: 2,
                    date: "2021-01-01",
                    score: 4,
                    position: "Software Engineer",
                    successful: 1
                },
                {
                    applicantId: 1,
                    interviewerId: 3,
                    date: "2021-01-01",
                    score: 3,
                    position: "DevOPS Engineer",
                    successful: 0
                },
                {
                    applicantId: 2,
                    interviewerId: 1,
                    date: "2021-01-04",
                    score: 3,
                    position: "DevOPS Engineer",
                    successful: 0
                },
                {
                    applicantId: 2,
                    interviewerId: 2,
                    date: "2021-01-04",
                    score: 4,
                    position: "Web Developer",
                    successful: 1
                },
                {
                    applicantId: 2,
                    interviewerId: 3,
                    date: "2021-01-04",
                    score: 2,
                    position: "Web Developer",
                    successful: 0
                },
                {
                    applicantId: 3,
                    interviewerId: 1,
                    date: "2021-01-07",
                    score: 5,
                    position: "Frontend Developer",
                    successful: 1
                },
                {
                    applicantId: 3,
                    interviewerId: 2,
                    date: "2021-01-07",
                    score: 5,
                    position: "Frontend Developer",
                    successful: 1
                },
                {
                    applicantId: 3,
                    interviewerId: 3,
                    date: "2021-01-07",
                    score: 4,
                    position: "Backend Developer",
                    successful: 1
                }
            ]
    
        const dropInterviewsTable = db.prepare(`
            DROP TABLE IF EXISTS interviews;
        `)
        dropInterviewsTable.run();

        const createInterviewsTable = db.prepare(`
            CREATE TABLE IF NOT EXISTS interviews (
                id INTEGER NOT NULL,
                applicantId INTEGER NOT NULL,
                interviewerId INTEGER  NOT NULL,
                date TEXT,
                score INTEGER,
                position TEXT,
                successful INTEGER,
                PRIMARY KEY (id),
                FOREIGN KEY (applicantId) REFERENCES applicants(id) ON DELETE CASCADE,
                FOREIGN KEY (interviewerId) REFERENCES interviewers(id) ON DELETE CASCADE
            );
        `)
        createInterviewsTable.run();

    
        const createNewInterview = db.prepare(`
            INSERT INTO interviews (applicantId, interviewerId, date, score, position, successful) VALUES (@applicantId, @interviewerId, @date, @score, @position, @successful);
        `)
    
        for(let interview of interviews){
            createNewInterview.run(interview);
        }
}



function everythingCompanies(){
        
        const companies = [
            {
                name: "Facebook",
                city: "Menlo Park"
            },
            {
                name: "Google",
                city: "Mountain View"
            },
            {
                name: "Apple",
                city: "Cupertino"
            }
        ]
    
    const dropCompaniesTable = db.prepare(`
        DROP TABLE IF EXISTS companies;
    `)
    dropCompaniesTable.run();
    
    const createCompaniesTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS companies (
            id INTEGER NOT NULL,
            name TEXT NOT NULL,
            city TEXT NOT NULL,
            PRIMARY KEY (id)
        );
    `)
    createCompaniesTable.run();
    
    const createNewCompany = db.prepare(`
        INSERT INTO companies (name, city) VALUES (@name, @city);
    `)
    
    for(let company of companies){
        createNewCompany.run(company);
    }
}



function everythingEmployees(){
            
            const employees = [
                {
                    name: "Mark Zuckerberg",
                    email: "mark@facebook.com",
                    position: "CEO",
                    companyId: 1
                },
                {
                    name: "Sundar Pichai",
                    email: "sundar@gmail.com",
                    position: "CEO",
                    companyId: 2
                },
                {
                    name: "Tim Cook",
                    email: "tim@apple.com",
                    position: "CEO",
                    companyId: 3
                }
            ]

        const dropEmployeesTable = db.prepare(`
            DROP TABLE IF EXISTS employees;
        `)
        dropEmployeesTable.run();

        const createEmployeesTable = db.prepare(`
            CREATE TABLE IF NOT EXISTS employees (
                id INTEGER NOT NULL,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                position TEXT NOT NULL,
                companyId INTEGER NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE
            );
        `)
        createEmployeesTable.run();

        const createNewEmployee = db.prepare(`
            INSERT INTO employees (name, email, position, companyId) VALUES (@name, @email, @position, @companyId);
        `)

        for(let employee of employees){
            createNewEmployee.run(employee);
        }
}

everythingCompanies();
everythingEmployees();
everythingApplicants();
everythingInterviewers();
everythingInterviews();