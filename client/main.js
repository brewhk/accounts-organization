import LibOrganization from '../lib/functions.js';
import ClientOrganization from './functions.js';

const Organization = Object.assign({}, LibOrganization, ClientOrganization);

export default Organization;
