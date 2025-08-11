# Usamos una imagen base con Java 17 y Maven
FROM maven:3.8.7-eclipse-temurin-17 AS build

# Copiamos los archivos del proyecto
WORKDIR /app
COPY pom.xml .
COPY src ./src

# Construimos el JAR
RUN mvn clean package -DskipTests

# Segunda etapa, imagen más liviana para correr la app
FROM eclipse-temurin:17-jre

# Copiamos el JAR desde la etapa build
COPY --from=build /app/target/*.jar app.jar

# Puerto donde corre Spring Boot
EXPOSE 8080

# Comando para iniciar la app
ENTRYPOINT ["java", "-jar", "/app.jar"]
