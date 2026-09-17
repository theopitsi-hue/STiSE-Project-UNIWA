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

## Preview
### Log In - Register
<img width="869" height="847" alt="image" src="https://github.com/user-attachments/assets/0b1f4775-9102-4082-9f0a-6ff874345f3b" />

### Shop Search
<img width="1840" height="809" alt="image" src="https://github.com/user-attachments/assets/a205e83c-93d6-4d2a-892f-dd800a328bc4" />

### Food Browser
<img width="1851" height="854" alt="image" src="https://github.com/user-attachments/assets/9783ac4d-1bd9-41b4-9e6d-53e885addd38" />


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

### Run Client (React)
```
cd ../Springroll-Client
npm install
npm start
```

## Additional tools used
- Project Management: Jira
- ORM: Hibernate (as part of Springboot)
- Testing: Junit (as part of Springboot)
- Database Hosting: Docker
- IDE(s): Intellij, VS Code
- Plugins: Lombok

## Attributions
Some images used for stores and other visual content in this project are sourced from Pixabay (https://pixabay.com) and are used in accordance with its free license. Some names and pictures are property of real stores and are only used for educational purposes.
