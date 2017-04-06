import LibOrganizations from '../lib/functions.js';
import ClientOrganizations from './functions.js';

const Organizations = Object.assign({}, LibOrganizations, ServerOrganizations);

export default Organizations;
