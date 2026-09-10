FROM harbor.containers.wurnet.nl/proxy-cache/library/maven:3.9.11-eclipse-temurin-21 AS build
COPY src /app/src
COPY pom.xml /app/pom.xml
WORKDIR /app
RUN mvn package -DskipTests
RUN mkdir -p target/dependency
WORKDIR /app/target/dependency
RUN jar -xf ../*.jar

FROM harbor.containers.wurnet.nl/proxy-cache/eclipse-temurin:21
ARG DEPENDENCY=/app/target/dependency
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app
ENTRYPOINT ["java","-cp","app:app/lib/*","nl.soilwise.repo.RepoApplication"]
