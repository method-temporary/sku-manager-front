import { axiosApi as axios, NameValueList } from '@nara.platform/accent';
import { CategoryModel } from '../../model/CategoryModel';
import { CategoryListModel } from '../../model/CategoryListModel';

export default class CategoryApi {
  //
  URL = '/api/board/categories';

  static instance: CategoryApi;

  registerCategories(addNewCategories: CategoryListModel) {
    //
    return axios
      .post<string>(this.URL + `/list`, addNewCategories)
      .then((response) => (response && response.data) || null)
      .catch((reason) => {});
  }

  findCategoriesByBoardId(boardId: string) {
    //
    return axios.get<CategoryModel[]>(this.URL + `/${boardId}`).then((response) => (response && response.data) || null);
  }

  modifyCategory(categoryId: string, nameValues: NameValueList) {
    //
    return axios.put<void>(this.URL + `/${categoryId}`, nameValues);
  }

  removeCategory(categoryId: string) {
    //
    return axios.delete(this.URL + `/${categoryId}`).then((response) => (response && response.data) || null);
  }
}

Object.defineProperty(CategoryApi, 'instance', {
  value: new CategoryApi(),
  writable: false,
  configurable: false,
});
