export default class ChartTreeViewModel {
  key: string = '';
  label: string = '';
  type: string = '';
  index: string = '';
  level: string = '';
  language: string = '';
  company: string = '';
  nodes: ChartTreeViewModel[] = [];
  //chartDisplayed: boolean|undefined;
  treeId?: string = '';
  categoryId?: string = '';

  constructor(commonChartApiModel: ChartTreeViewModel) {
    if (commonChartApiModel) {
      Object.assign(this, { ...commonChartApiModel });
    }
  }
}
