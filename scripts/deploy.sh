#!/bin/sh
##
# Script to deploy a Kubernetes project with a StatefulSet running a MongoDB Replica Set and API, to a local Minikube environment.
# Variables
red=`tput setaf 1`
yellow=`tput setaf 3`
green=`tput setaf 2`
reset=`tput sgr0`

# Timestamp
timestamp() {
  date +"%Y-%m-%d %H:%M:%S"
}

echo "$(timestamp): ${green}Starting!${reset}"

# Ensure some configs
docker_state=$(docker info >/dev/null 2>&1)
if [[ $? -ne 0 ]]; then
    echo "$(timestamp): ${red}Docker does not seem to be running, run it first and retry${reset}"
    tput sgr0
    exit 1
	else
	echo "$(timestamp): ${green}Docker is running..."
    tput sgr0
fi
minikube_state=$(minikube status >/dev/null 2>&1)
if [[ $? -ne 0 ]]; then
    echo "$(timestamp): ${red}Minikube does not seem to be running, run it first and retry${reset}"
    tput sgr0
    exit 1
	else
	echo "$(timestamp): ${green}Minikube is running..."
    tput sgr0
fi

# Enable ingress for minikube
minikube addons enable ingress &> /dev/null

# Set docker env
eval $(minikube docker-env)

# Run, Build, Tag and Push image to local docker registry (Acessible by minikube)
docker run --quiet -d -p 5000:5000 --restart=always --name registry registry:2 &> /dev/null
docker-compose -f ./api-config-service/docker-compose.yml build &> /dev/null
docker tag --quietapi-config-service localhost:5000/api-config-service &> /dev/null
docker push --quiet localhost:5000/api-config-service &> /dev/null

# Start Deploy
echo "$(timestamp): ${green}Creating Storage Class...${reset}"
kubectl apply -f ./manifests/mongo-storage.json &> /dev/null
echo "$(timestamp): ${green}Creating Stateful Set...${reset}"
kubectl apply -f ./manifests/mongo-statefulset.json &> /dev/null
echo "$(timestamp): ${green}Creating Service...${reset}"
kubectl apply -f ./manifests/mongo-svc.json &> /dev/null
echo "$(timestamp): ${green}Creating API...${reset}"
kubectl apply -f ./manifests/api-config-service-deployment-ru.json &> /dev/null
echo "$(timestamp): ${green}Creating API Service...${reset}"
kubectl apply -f ./manifests/api-config-service-svc.json &> /dev/null
echo "$(timestamp): ${green}Creating Ingress for API...${reset}"
kubectl apply -f ./manifests/ingress-api.json &> /dev/null
echo "$(timestamp): ${yellow}Please insert your password to ADD dns for config-service on /etc/hosts${reset}"
tput sgr0
sudo -- sh -c "echo  \ \ >> /etc/hosts";sudo -- sh -c "echo '$(minikube ip)  config-service' >> /etc/hosts"
tput sgr0
echo "$(timestamp): ${green}Waiting API startup...${reset}"
sleep 25
echo "$(timestamp): ${green}Deploy completed!${reset}"