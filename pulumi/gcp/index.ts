import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import { database, dbInstance, dbUser } from './database';
import { deployWikiJS } from './wikijs';


const wiki = deployWikiJS(dbInstance, database, dbUser);

export default {
    wiki
}