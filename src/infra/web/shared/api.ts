import aspida from '@aspida/axios';
import api from '^/pages/api/$api';

export const client = api(aspida());
