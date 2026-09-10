# SoilWise Repo Application 

## Localhost
For testing on localhost you need to have a Tika Server available in Docker Desktop
An official image for Tika can be found at DockerHub. You can download and start it in PowerShellwith:
- docker run -d -p 9998:9998 apache/tika:3.3.0.0-full
  It will then be available as http://localhost:9998/rmeta/text
And for grobid use:
-  docker run -d --init --ulimit core=0 -p 8070:8070 --name grobid grobid/grobid:0.9.1-crf
In a differen Powershell test your version with:
- curl http://localhost:8070/api/version
  

## Docling/Tika
```
docker run -p 5001:5001 -e DOCLING_SERVE_MAX_SYNC_WAIT=300 ghcr.io/docling-project/docling-serve-cpu:v1.32.0
docker run -p 9998:9998 harbor.containers.wurnet.nl/proxy-cache/apache/tika:3.3.0.0-full
```


I think anything below this line is outdated
---


Providing the data in the database

## Test 
- tpostgreswenr1.cdbe.wurnet.nl
- https://repo.soilwise-he-test.containers.wurnet.nl
- https://soilwise-he-test.containers.wur.nl/search-api/swagger-ui/index.html

## Production 
- ppostgreswenr1.cdbe.wurnet.nl:5432/prod_soilwise?currentSchema=harvest
- https://repo.soilwise-he.containers.wur.nl
- https://repo.soilwise-he.containers.wur.nl/swagger-ui/index.html

## Solr
 - kubectl get pods -n soilwise-prod | Select-String  solr
 - kubectl exec -it po/soilwise-solr-XXXX -n soilwise-prod /bin/bash
 - kubectl cp soilwise-solr-XXXX:/app .\wur_projects\soilwise\soilwise-solr\app\  -n soilwise-prod
 - kubectl cp .\wur_projects\soilwise\soilwise-solr\app\data\records\conf\schema.xml soilwise-solr-XXXX:/app/data/records/conf -n soilwise-prod
 - curl --user solr:Soilwise_solr1. "https://solr.soilwise-he.containers.wur.nl/solr/records/update" -H 'Content-Type: application/json' -d '{"delete":{"query":"*:*"}}'