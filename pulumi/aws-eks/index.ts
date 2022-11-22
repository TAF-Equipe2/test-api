import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";
import * as aws from "@pulumi/aws";
import * as k8s from "@pulumi/kubernetes"
import { readK8sDefinition } from "./utils/k8s-definitions";
import * as path from "path";

// Grab some values from the Pulumi configuration (or use default values)
const config = new pulumi.Config();
const minClusterSize = config.getNumber("minClusterSize") || 1;
const maxClusterSize = config.getNumber("maxClusterSize") || 2;
const desiredClusterSize = config.getNumber("desiredClusterSize") || 1;
const eksNodeInstanceType = config.get("eksNodeInstanceType") || "t2.micro";
const vpcNetworkCidr = config.get("vpcNetworkCidr") || "10.0.0.0/16";

// Create a new VPC
const eksVpc = new awsx.ec2.Vpc("eks-vpc", {
    enableDnsHostnames: true,
    cidrBlock: vpcNetworkCidr,
    numberOfNatGateways: 1
});

// Using default-vpc to cut on cost
// new awsx.ec2.DefaultVpc("default-vpc");


export const aws_auth_configMap = pulumi.output(aws.iam.getGroup({
    groupName: "CloudDeveloper",
})).apply((iamUserGroup)=>{
    return iamUserGroup.users.map((user)=>{
        return {
            userArn: user.arn,
            groups: ["system:masters"],
            username: "pulumi:admins",
        };
    })
});

// Create the EKS cluster
const eksCluster = new eks.Cluster("eks-cluster", {
    // Put the cluster in the new VPC created earlier
    vpcId: eksVpc.id,
    // Public subnets will be used for load balancers
    publicSubnetIds: eksVpc.publicSubnetIds,
    // Private subnets will be used for cluster nodes
    privateSubnetIds: eksVpc.privateSubnetIds,
    // Change configuration values to change any of the following settings
    instanceType: eksNodeInstanceType,
    desiredCapacity: desiredClusterSize,
    minSize: minClusterSize,
    maxSize: maxClusterSize,
    // Do not give the worker nodes public IP addresses
    nodeAssociatePublicIpAddress: true,
    // Uncomment the next two lines for a private cluster (VPN access required)
    // endpointPrivateAccess: true,
    // endpointPublicAccess: true
    userMappings: aws_auth_configMap
});

// Export some values for use elsewhere
export const kubeconfig = eksCluster.kubeconfig;
export const vpcId = eksVpc.id;


// Build and publish to an ECR registry.
const repo_front = new awsx.ecr.Repository("taf-front");
const image_front = repo_front.buildAndPushImage("../../frontend");
const repo_back = new awsx.ecr.Repository("taf-back");
const image_back = repo_back.buildAndPushImage({
    dockerfile: path.resolve(process.cwd(), '../..', 'backend/Dockerfile'),
    context: path.resolve(process.cwd(), '../..')
});
const repo_tests_ui = new awsx.ecr.Repository("tests-ui");
const image_tests_ui = repo_tests_ui.buildAndPushImage("../../tests-ui/tests-ui");
const repo_selenium = new awsx.ecr.Repository("selenium");
const image_selenium = repo_selenium.buildAndPushImage("../../selenium");

// Starting a new DB instance for the TAF Backend
const DB_Username = config.require("TAF_DB_Username");
export const DB_Password = config.requireSecret("TAF_DB_Password");

const DB_TAF_Backend = new aws.rds.Instance("db-taf-backend", {
    allocatedStorage: 10,
    dbName: "DB_TAF_Backend",
    engine: "mysql",
    engineVersion: "5.7",
    instanceClass: "db.t3.micro",
    parameterGroupName: "default.mysql5.7",
    username: `${DB_Username}`,
    password: pulumi.interpolate`${DB_Password}`,
    skipFinalSnapshot: true,
});

export const DB_Address = DB_TAF_Backend.address

// Namespace to isolate resources used for TAF
const nsDefinition = readK8sDefinition('Namespace.yml');
const ns = new k8s.core.v1.Namespace("taf", nsDefinition, {provider: eksCluster.provider});

// Deploying TAF Backend
const backendSecretDefinition = readK8sDefinition('taf/backend/Secret.yml');
backendSecretDefinition.stringData.username = DB_Username;
backendSecretDefinition.stringData.password = pulumi.interpolate`${DB_Password}`;
const backendSecret = new k8s.core.v1.Secret('taf-backend-secret', backendSecretDefinition, { provider: eksCluster.provider, dependsOn: [ns] });

const backendDeploymentDefinition = readK8sDefinition('taf/backend/Deployment.yml');
backendDeploymentDefinition.spec.template.spec.containers[0].image = image_back;
backendDeploymentDefinition.spec.template.spec.containers[0].env[0].value = DB_Address;
const backendDeployment = new k8s.apps.v1.Deployment('taf-backend-deployment', backendDeploymentDefinition, {provider: eksCluster.provider, dependsOn: [backendSecret]});

const backendServiceDefinition = readK8sDefinition('taf/backend/Service.yml');
const backendService = new k8s.core.v1.Service('taf-backend-service', backendServiceDefinition, {provider: eksCluster.provider, dependsOn: [backendDeployment]});

// Export the URL for the load balanced service.
export const back_url = backendService.status.loadBalancer.ingress[0].hostname;

// Deploying TAF Frontend
const frontendDeploymentDefinition = readK8sDefinition('taf/frontend/Deployment.yml');
frontendDeploymentDefinition.spec.template.spec.containers[0].image = image_front;
const frontendDeployment = new k8s.apps.v1.Deployment('taf-frontend-deployment', frontendDeploymentDefinition, { provider: eksCluster.provider, dependsOn: [ns] });

const frontendServiceDefinition = readK8sDefinition('taf/frontend/Service.yml');
const frontendService = new k8s.core.v1.Service('taf-frontend-service', frontendServiceDefinition, { provider: eksCluster.provider, dependsOn: [frontendDeployment] });

// Export the URL for the load balanced service.
export const front_url = frontendService.status.loadBalancer.ingress[0].hostname;

/*
const appBackendName = "taf-backend";
const appLabels = {appClass: appBackendName};
const deployment_back = new k8s.apps.v1.Deployment(`${appBackendName}-deployment`, {
    metadata: {labels: appLabels},
    spec: {
        replicas: 1,
        selector: {matchLabels: appLabels},
        template: {
            metadata: {
                labels: appLabels,
                namespace: TAFNamespaceName
            },
            spec: {
                containers: [{
                    name: appBackendName,
                    image: image_back,
                    ports: [{name: "http", containerPort: 80}],
                    env: [
                        {
                            name: "SPRING_DATASOURCE_URL",
                            value: DB_Address //address:port
                        },
                        {
                            name: "SPRING_DATASOURCE_USERNAME",
                            valueFrom: {
                                secretKeyRef: {name: secret_db_config.metadata.name, key: "username"}
                            }
                        },
                        {
                            name: "SPRING_DATASOURCE_PASSWORD",
                            valueFrom: {
                                secretKeyRef: {
                                    name: secret_db_config.metadata.name,
                                    key: "password"
                                }
                            }
                        }]
                }],
            }
        }
    },
}, {provider: eksCluster.provider});

const service_backend = new k8s.core.v1.Service(`${appBackendName}-svc`, {
    metadata: {
        labels: appLabels,
        namespace: TAFNamespaceName
    },
    spec: {
        type: "LoadBalancer",
        ports: [{port: 9000, targetPort: "http"}],
        selector: appLabels,
    },
}, {provider: eksCluster.provider});

// Export the URL for the load balanced service.
export const back_url = service_backend.status.loadBalancer.ingress[0].hostname;

// Deploying frontend
const appFrontendName = "taf-frontend"
const appFrontLabels = {appClass: appFrontendName};
const deployment_front = new k8s.apps.v1.Deployment(`${appFrontendName}-deployment`, {
    metadata: {labels: appFrontLabels, namespace: TAFNamespaceName},
    spec: {

        replicas: 1,
        selector: {matchLabels: appFrontLabels},
        template: {
            metadata: {labels: appFrontLabels},
            spec: {
                containers: [{
                    name: appFrontendName,
                    image: image_back,
                    ports: [{name: "http", containerPort: 80}]
                }],
            }
        }
    },
}, {provider: eksCluster.provider});

const service_frontend = new k8s.core.v1.Service(`${appFrontendName}-svc`, {
    metadata: {labels: appFrontLabels, namespace: TAFNamespaceName},
    spec: {
        type: "LoadBalancer",
        ports: [{port: 4200, targetPort: "http"}],
        selector: appFrontLabels,
    },
}, {provider: eksCluster.provider});

// Export the URL for the load balanced service.
export const front_url = service_frontend.status.loadBalancer.ingress[0].hostname;
 */