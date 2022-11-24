import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import * as k8s from "@pulumi/kubernetes";
import * as path from "path";
import { eksCluster, k8sNamespace } from "../eks-cluster";
import { readK8sDefinition } from "../utils/k8s-definitions";

// Build and publish to an ECR registry.
const repo_tests_ui = new awsx.ecr.Repository("tests-ui");
const image_tests_ui = repo_tests_ui.buildAndPushImage(path.resolve(process.cwd(), "../..", "tests-ui/tests-ui"));
const repo_selenium = new awsx.ecr.Repository("selenium");
const image_selenium = repo_selenium.buildAndPushImage(path.resolve(process.cwd(), "../..", "selenium"));

// Deploy Selenium server
const seleniumDeploymentDefinition = readK8sDefinition('team-1-selenium/selenium-server/Deployment.yml');
seleniumDeploymentDefinition.spec.template.spec.containers[0].image = image_selenium;
const seleniumDeployment = new k8s.apps.v1.Deployment('team-1-selenium-deployment', seleniumDeploymentDefinition, { provider: eksCluster.provider, dependsOn: [k8sNamespace] });

const seleniumServiceDefinition = readK8sDefinition('team-1-selenium/selenium-server/Service.yml');
const seleniumService = new k8s.core.v1.Service('team-1-selenium-service', seleniumServiceDefinition, {provider: eksCluster.provider, dependsOn: [seleniumDeployment]});


// Deploy UI
const UIDeploymentDefinition = readK8sDefinition('team-1-selenium/app/Deployment.yml');
UIDeploymentDefinition.spec.template.spec.containers[0].image = image_tests_ui;
UIDeploymentDefinition.spec.template.spec.containers[0].env[0].value = pulumi.interpolate`${seleniumService.status.loadBalancer.ingress}:${seleniumService.spec.ports[0].port}`
const UIDeployment = new k8s.apps.v1.Deployment('team-1-ui-deployment', UIDeploymentDefinition, { provider: eksCluster.provider, dependsOn: [k8sNamespace] });

const UIServiceDefinition = readK8sDefinition('team-1-selenium/app/Service.yml');
const UIService = new k8s.core.v1.Service('team-1-ui-service', UIServiceDefinition, {provider: eksCluster.provider, dependsOn: [UIDeployment]});

// Export the URL for the load balanced service.
export const team_1_url = UIService.status.loadBalancer.ingress[0].hostname;