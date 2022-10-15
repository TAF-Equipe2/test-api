import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { cloudRunService, iamService } from './apis';
import { dockerRegistry } from './registry';

const cfg = new pulumi.Config();

export const deployWikiJS = (dbInstance: gcp.sql.DatabaseInstance, db: gcp.sql.Database, dbUser: gcp.sql.User) => {

    const serviceAccount = new gcp.serviceaccount.Account('wikijs-service-user', {
        accountId: 'wikijs-service-user'
    }, {dependsOn: [iamService]});

    const serviceAccountPermission = new gcp.projects.IAMBinding('wikijs-service-user-iam', {
        members: [pulumi.interpolate`serviceAccount:${serviceAccount.email}`],
        role: 'roles/iam.serviceAccountUser',
        project: 'euphoric-drive-365518'
    });
    

    const appService = new gcp.cloudrun.Service('wikijs', {
        location: 'europe-west1',

        traffics: [{
            percent: 100,
            latestRevision: true
        }],

        template: {
            spec: {
                serviceAccountName: serviceAccount.email,
                containers: [{
                    image: pulumi.interpolate`${dockerRegistry.location}-docker.pkg.dev/euphoric-drive-365518/${dockerRegistry.name}/wikijs:latest`,
                    ports: [{
                        containerPort: 3000
                    }],
                    envs: [
                        {
                            name: 'DB_TYPE',
                            value: 'mysql'
                        },
                        {
                            name: 'DATABASE_URL',
                            value: pulumi.interpolate`mysql://${dbUser.name}:${cfg.requireSecret('db-user-password')}@localhost:3306?socketPath=/cloudsql/${dbInstance.connectionName}`
                        },
                        {
                            name: 'DB_HOST',
                            value: 'localhost'
                        },
                        {
                            name: 'DB_PORT',
                            value: '3306'
                        },
                        {
                            name: 'DB_USER',
                            value: dbUser.name
                        },
                        {
                            name: 'DB_PASSWORD',
                            value: cfg.requireSecret('db-user-password')
                        },
                        {
                            name: 'DB_NAME',
                            value: db.name
                        },
                        {
                            name: 'DB_SOCKET',
                            value: pulumi.interpolate`/cloudsql/${dbInstance.connectionName}`
                        }
                    ]
                }]
            },
            metadata: {
                annotations: {
                    "run.googleapis.com/cloudsql-instances": dbInstance.connectionName,
                }
            }
        },
        autogenerateRevisionName: true,
    }, {dependsOn: [cloudRunService, serviceAccountPermission, dockerRegistry]});

    const noauthIAMPolicy = gcp.organizations.getIAMPolicy({
        bindings: [{
            role: "roles/run.invoker",
            members: ["allUsers"],
        }],
    });
    const noauthIamPolicy = new gcp.cloudrun.IamPolicy("noauthIamPolicy", {
        location: appService.location,
        project: appService.project,
        service: appService.name,
        policyData: noauthIAMPolicy.then(noauthIAMPolicy => noauthIAMPolicy.policyData),
    });
}