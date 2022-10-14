import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";

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
});

// Build and publish to an ECR registry.
const repo_front = new awsx.ecr.Repository("taf-front");
const image_front = repo_front.buildAndPushImage("./frontend");
const repo_back = new awsx.ecr.Repository("taf-back");
const image_back = repo_back.buildAndPushImage("./backend");


// Create the EKS cluster
const eksCluster = new eks.Cluster("eks-cluster", {
    // Put the cluster in the new VPC created earlier
    vpcId: eksVpc.vpcId,
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
    nodeAssociatePublicIpAddress: false,
    // Uncomment the next two lines for a private cluster (VPN access required)
    endpointPrivateAccess: true,
    endpointPublicAccess: true
});

// Export some values for use elsewhere
export const kubeconfig = eksCluster.kubeconfig;
export const vpcId = eksVpc.vpcId;

//const ns = new k8s.core.v1.Namespace("wikijs", {}, {provider: eksCluster.provider})
/*

const wikijs_chart = new k8s.helm.v3.Chart("wikiJS", {
    chart: "requarks/wiki",
    namespace : "wikiJS",
    repo:"latest",
    fetchOpts: {
        repo: "https://charts.js.wiki/latest",
    },
});
*/

/*
const wikijs_release = new k8s.helm.v3.Release("wiki",
    {
        chart: "wiki",
        repositoryOpts: {
            repo: "https://charts.js.wiki"
        }
    }, {provider: eksCluster.provider}
)
*/
