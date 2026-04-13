# SoilWise-he - SoilWiseFinder

SoilWiseFinder provides the front-end and back-end components of the SoilWise catalogue discovery user interface. It consists of (1) a React/Javascript User interface, (2) an API that provides the NLP supported indexing of metadata into the Apache Lucene index and the querying of the index via the Solr search engine libraries and (3) the required configuration of the Solr search engine. 
 
## Features 

SoilWiseFinder supports the following features:

Metadata & knowledge NLP transformations and indexation (part of KM)
Search API on Solr 
Solr configuration
Catalogue User Interface, offering
- Fulltext search
- Thematic filtering (licence, language, project, source, keywords, Soil Mission programme)
- Spatial filtering
- Temporal filtering
- Ranking / sorting
- Spatial extent preview
- Display record details
- Data download (AS IS)
- Download search results
 
## Installation 

_Prerequisites_: a Postgres database with a table or view called mv_records (the structure is defined by the metadata model)

Three components need to be installed (local installation):
- Solr:
  - In a command prompt go to the solr directory of the repository
  - Run: docker build -f Dockerfile-dev .
- Search API:
  - In a command prompt go the the search-api directory of the repository
  - Provide a file application.properties in the directory src/main/resources (a template is given in that directory)
  - Run: mvn clean package -Dskiptests
- Search UI:
  - In a command prompt go the to search-ui directory of the repository
  - Provide a file .env in the root directory (a template is given in that directory)
  - Run: npm install
  - Run: npm start:local
 
## Usage 

Once all three components are running you can go to https://localhost:3002 and start using the Catalogue UI. There is more information under the i-icon to see how you can search and how the different elements are working.

<img width="1898" height="987" alt="image" src="https://github.com/user-attachments/assets/6dc28105-60ce-4779-9f55-0baf6748099b" />

 
## Soilwise-he project 
 
This work has been initiated as part of the [Soilwise-he](https://soilwise-he.eu) project. The project 
receives funding from the European Union’s HORIZON Innovation Actions 2022 under grant agreement 
No. 101112838. Views and opinions expressed are however those of the author(s) only and do not 
necessarily reflect those of the European Union or Research Executive Agency. Neither the European 
Union nor the granting authority can be held responsible for them.
