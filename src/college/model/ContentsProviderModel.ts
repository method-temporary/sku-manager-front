import { decorate, observable } from 'mobx';
import { DramaEntity } from '@nara.platform/accent';
import { PatronKey, PolyglotModel } from 'shared/model';
import { AreaType } from './AreaType';

export class ContentsProviderModel implements DramaEntity {
  //
  id: string = '';
  entityVersion: number = 0;
  patronKey: PatronKey = new PatronKey();

  providerId: string = '';
  name: PolyglotModel = new PolyglotModel();
  // contentsProvider: IdName = new IdName();
  areaType: AreaType = AreaType.Internal;
  isUse: boolean = false;
  time: number = 0;

  constructor(contentsProvider?: ContentsProviderModel) {
    //
    if (contentsProvider) {
      //
      const newContentsProvider = contentsProvider.id &&
        contentsProvider.name && { id: contentsProvider.id, name: new PolyglotModel(contentsProvider.name) };

      const name = (contentsProvider.name && new PolyglotModel(contentsProvider.name)) || this.name;

      Object.assign(this, { ...contentsProvider, newContentsProvider, name });
    }
  }
}

decorate(ContentsProviderModel, {
  id: observable,
  entityVersion: observable,
  patronKey: observable,

  providerId: observable,
  name: observable,
  areaType: observable,
  isUse: observable,
  time: observable,
});
