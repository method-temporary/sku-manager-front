import CategoryCdo from '../../model/sdo/CategoryCdo';
import { NameValueList } from 'shared/model';
import { SupportType } from '../../model/vo/SupportType';
import CategoryModel from '../../model/CategoryModel';
import { axiosApi as axios } from 'shared/axios/Axios';

class CategoryApi {
  //
  static instance: CategoryApi;
  URL = '/api/support/categories/admin';

  findAll(supportType: SupportType): Promise<CategoryModel[]> {
    //
    return axios
      .getLoader(this.URL, { params: { supportType } })
      .then((response) => (response && response.data) || null);
  }

  findAllForExcel(supportType: SupportType): Promise<CategoryModel[]> {
    //
    return axios.get(this.URL, { params: { supportType } }).then((response) => (response && response.data) || null);
  }

  findMainCategories(supportType: SupportType): Promise<CategoryModel[]> {
    //
    return axios
      .getLoader(this.URL + `/main`, { params: { supportType } })
      .then((response) => (response && response.data) || null);
  }

  findSubCategories(supportType: SupportType, parentId: string): Promise<CategoryModel[]> {
    //
    return axios
      .getLoader(this.URL + `/sub/${parentId}`, { params: { supportType } })
      .then((response) => (response && response.data) || null);
  }

  registerCategory(categoryCdo: CategoryCdo): Promise<string> {
    //
    return axios.postLoader(this.URL, categoryCdo).then((response) => (response && response.data) || null);
  }

  modifyCategory(categoryId: string, nameValueList: NameValueList): Promise<void> {
    //
    return axios
      .putLoader(this.URL + `/${categoryId}`, nameValueList)
      .then((response) => (response && response.data) || null);
  }

  // TODO FAQ 카테고리는 이전 api 사용으로 인한 임시 함수
  findPrevAll(supportType: SupportType): Promise<CategoryModel[]> {
    //
    return axios
      .getLoader(`/api/board/categories/${supportType}`)
      .then((response) => (response && response.data) || null);
  }
}

export default CategoryApi;
CategoryApi.instance = new CategoryApi();
