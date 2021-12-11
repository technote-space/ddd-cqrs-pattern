import aspida from '@aspida/axios';
import { Api } from '@/web/shared/api';
import api from '^/pages/api/$api';

export class TestApi extends Api {
  public constructor() {
    super(api(aspida()) as never);
  }
}
