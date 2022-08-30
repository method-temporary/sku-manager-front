import FaqApi from '../apiclient/FaqApi';
import { action, observable, runInAction } from 'mobx';
import FaqModel from '../../model/FaqModel';
import CategoryCdo from '../../../category/model/sdo/CategoryCdo';
import { NameValueList } from 'shared/model';
import FaqAdminRdo from '../../model/sdo/FaqAdminRdo';

class FaqService {
  //
  static instance: FaqService;
  faqApi: FaqApi;

  constructor(faqApi: FaqApi) {
    this.faqApi = faqApi;
  }

  @observable
  faq: FaqModel = new FaqModel();

  @observable
  faqs: FaqModel[] = [];

  register(categoryCdo: CategoryCdo): Promise<string> {
    // TODO:api spec이 완성 안된것 같음
    return this.faqApi.register(categoryCdo);
  }

  modify(id: string, nameValueList: NameValueList): Promise<void> {
    //
    return this.faqApi.modify(id, nameValueList);
  }

  @action
  async findByRdo(faqAdminRdo: FaqAdminRdo): Promise<FaqModel[]> {
    // TODO:api spec이 완성 안된것 같음
    const faqs = await this.faqApi.findByRdo(faqAdminRdo);
    runInAction(() => {
      this.faqs = faqs.map((faq) => new FaqModel(faq));
    });
    return this.faqs;
  }

  @action
  async findById(faqId: string): Promise<FaqModel> {
    //
    const faq = await this.faqApi.findById(faqId);
    runInAction(() => {
      this.faq = faq;
    });
    return this.faq;
  }
}

export default FaqService;
FaqService.instance = new FaqService(FaqApi.instance);
