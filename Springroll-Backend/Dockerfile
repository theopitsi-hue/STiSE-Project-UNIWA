# Use an official Java runtime as base image
FROM eclipse-temurin:17-jdk-alpine

# Set a working directory
WORKDIR /app

# Copy your jar file into the container
COPY target/*.jar app.jar

# Expose the port your Spring Boot app runs on
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java","-jar","/app/app.jar"]
