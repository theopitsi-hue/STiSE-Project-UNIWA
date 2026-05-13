# STiSE-Project-UNIWA
Special Topics in Software Engineering project developed during the winter semester of ICE UNIWA 2025/2026.

SpringRoll is a modern full-stack food delivery platform designed to emulate the experience and functionality of real-world online ordering applications. The system supports a wide variety of stores and products, allowing users to browse, order, and manage deliveries through an interactive and scalable environment.

The project combines multiple contemporary technologies and architectural components to deliver a complete end-to-end software solution, including:

- Frontend built with React, providing a responsive and user-friendly interface
- Backend powered by Spring Boot, exposing RESTful APIs and handling business logic, authentication, and data management
- A fully integrated admin panel for managing shops, products, users, orders, and application content
- Image hosting and media management capabilities for product previews, store branding, and admin user-uploaded assets
- Database-driven product categorization
- Secure user authentication and role-based access control
- Dynamic order processing and real-time application interaction
- Modular architecture following full-stack software engineering principles and scalable design practices

SpringRoll was developed as part of the Special Topics in Software Engineering course project to demonstrate practical knowledge in software engineering, full-stack development, UI/UX design, backend architecture, database integration, and modern web technologies.

This is a group project created and developed by: [Θεονύμφη Πιτσίλογλου, Νέβενα Ανδρίτσου, Σταυρούλα Ιωάννα Λεοντζάκου, Αικατερίνη Πλάγου], and uses React for the front-end, Springboot for the backend and MySQL for the database.

## Setup
### Clone the repository:
Using git on console..
`git clone https://github.com/theopitsi-hue/STiSE-Project-UNIWA.git`

Or alternatevly through GithubDesktop:
File -> clone Repository -> URL (`https://github.com/theopitsi-hue/STiSE-Project-UNIWA.git`)

### Initialize Backend (Springboot)
```
cd ../Springroll-Server
mvn spring-boot:run
```

## Run Client (React)
```
cd ../Springroll-Client
npm install
npm start
```

### Additional tools used
- Project Management: Jira
- ORM: Hibernate (as part of Springboot)
- Testing: Junit (as part of Springboot)
- Database Hosting: Docker
- IDE(s): Intellij, VS Code
- Plugins: Lombok

## Credits
Some images used for stores and other visual content in this project are sourced from Pixabay (https://pixabay.com) and are used in accordance with its free license.
