import DepotApi, { DepotUploadType } from '../apiclient/DepotApi';

class DepotService {
  //
  static instance: DepotService;

  depotApi: DepotApi;

  constructor(depotApi: DepotApi) {
    //
    this.depotApi = depotApi;
  }

  async uploadFile(file: File, uploadType: DepotUploadType) {
    //
    return this.depotApi.uploadFile(file, uploadType);
  }
}

Object.defineProperty(DepotService, 'instance', {
  value: new DepotService(DepotApi.instance),
  writable: false,
  configurable: false,
});

export { DepotUploadType, DepotService };

export default DepotService.instance;
