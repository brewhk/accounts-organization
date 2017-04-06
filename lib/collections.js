import { Mongo } from "meteor/mongo";

const Collections = {};

Collections.Organization = new Mongo.Collection('brewhk:accounts-organization/organization');
Collections.Membership = new Mongo.Collection('brewhk:accounts-organization/membership');

export default Collections;
