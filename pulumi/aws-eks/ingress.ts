import * as k8s from '@pulumi/kubernetes';
import { eksCluster, k8sNamespace } from './eks-cluster';
import { readK8sDefinition } from "./utils/k8s-definitions";

const globalIngressClassDefinition = readK8sDefinition('IngressClass.yml');
const globalIngressClass = new k8s.networking.v1.IngressClass('global-ingress-class', globalIngressClassDefinition, { provider: eksCluster.provider });

const globalIngressDefinition = readK8sDefinition('Ingress.yml');

const globalIngress = new k8s.networking.v1.Ingress(
    'global-ingress', 
    globalIngressDefinition, 
    { 
        provider: eksCluster.provider,
        dependsOn: [
            globalIngressClass,
            k8sNamespace,
        ]
    });

export const url = globalIngress.status.loadBalancer.ingress[0].hostname;