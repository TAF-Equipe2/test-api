
import * as gcp from '@pulumi/gcp';

export const cloudRunService = new gcp.projects.Service('cloudrun', {
    service: 'run.googleapis.com'
});


export const iamService = new gcp.projects.Service('iam', {
    service: 'iam.googleapis.com'
});