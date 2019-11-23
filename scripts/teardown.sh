#!/bin/sh
##
# Script to remove/undepoy all project resources from the local Minikube environment.
# Variables
red=`tput setaf 1`
yellow=`tput setaf 3`
green=`tput setaf 2`
reset=`tput sgr`

# Timestamp
timestamp() {
  date +"%Y-%m-%d %H:%M:%S"
}

echo "$(timestamp): ${green}Starting!"
tput sgr0

# Delete all resources
kubectl delete services,deployments config-service
kubectl delete services,statefulsets mongo
kubectl delete ingress.extensions/ingress-api

# Delete DNS entry from /etc/hosts
echo "$(timestamp): ${yellow}Please insert your password to REMOVE dns for config-service from the /etc/hosts"
tput sgr0
sudo perl -pi -e "s,^$(minikube ip).*config-service\n$,," /etc/hosts
tput sgr0

# Delete persistent volume claims
kubectl delete persistentvolumeclaims -l role=mongo

# Delete local docker registry
docker stop registry &> /dev/null
docker rmi localhost:5000/api-config-service -f &> /dev/null
docker rmi registry:2 -f &> /dev/null
docker rmi api-config-service -f &> /dev/null

echo "$(timestamp): ${green}Teardown completed!"
tput sgr0