import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';

const cfg = new pulumi.Config();

export const deployWikiJS = (dbInstance: gcp.sql.DatabaseInstance, db: gcp.sql.Database, dbUser: gcp.sql.User) => {
    const cloudRunService = new gcp.projects.Service('cloudrun', {
        service: 'run.googleapis.com'
    });

    const serviceAccount = new gcp.serviceaccount.Account('wikijs-service-user', {
        accountId: 'wikijs-service-user'
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
                    image: 'ghcr.io/requarks/wiki:2',
                    ports: [{
                        containerPort: 3000
                    }],
                    envs: [
                        {
                            name: 'DB_TYPE',
                            value: 'mysql'
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
    }, {dependsOn: [cloudRunService]});

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