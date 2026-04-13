# Soilwise-Solr

## Deploying

A container is running on kubernetes with the latest version of solr. Updates are made by changing the configuration, i.e. updating schema.xml in the folder app/data/configsets/metadata/conf. This means that this file has to be copied to the pod when the file has changed.

To get the POD ID (can also be retrieved from ARGOCD):

kubectl get pods -n soilwise-test | grep solr

To see what is in the file system of the pod:

kubectl exec -it <POD_ID> -n soilwise-test -- /bin/bash

Copy the data folder from your local solr folder (the main folder of the git repository) to the pod:

kubectl cp <LOCAL_SOLR_REPOSITORY_FOLDER>/app/data <POD_ID>:/app -n soilwise-test

Restart the pod
