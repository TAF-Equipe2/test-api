import * as gcp from '@pulumi/gcp';

export const dockerRegistry = new gcp.artifactregistry.Repository('docker', {
    format: 'DOCKER',
    location: 'europe-west1',
    repositoryId: 'docker'
});