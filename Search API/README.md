# SoilWise Repo Application

Providing the data in the database

## Test 
- ppostgres12_si.cdbe.wurnet.nl:5432/test_soilwise?currentSchema=harvest
- https://repo.soilwise-he-test.containers.wurnet.nl
- https://repo.soilwise-he-test.containers.wurnet.nl/swagger-ui/index.html

## Production 
- ppostgres12_si.cdbe.wurnet.nl:5432/prod_soilwise?currentSchema=harvest
- https://repo.soilwise-he.containers.wur.nl
- https://repo.soilwise-he.containers.wur.nl/swagger-ui/index.html

## Solr
 - kubectl get pods -n soilwise-prod | Select-String  solr
 - kubectl exec -it po/soilwise-solr-XXXX -n soilwise-prod /bin/bash
 - kubectl cp soilwise-solr-XXXX:/app .\wur_projects\soilwise\soilwise-solr\app\  -n soilwise-prod
 - kubectl cp .\wur_projects\soilwise\soilwise-solr\app\data\records\conf\schema.xml soilwise-solr-XXXX:/app/data/records/conf -n soilwise-prod
 - curl --user solr:Soilwise_solr1. "https://solr.soilwise-he.containers.wur.nl/solr/records/update" -H 'Content-Type: application/json' -d '{"delete":{"query":"*:*"}}'