import { decorate, observable } from 'mobx';
import { PolyglotModel } from 'shared/model';
import ChannelSdo from './ChannelSdo';

export default class CollegeSdo {
  //
  name: PolyglotModel = new PolyglotModel();
  description: PolyglotModel = new PolyglotModel();

  displayOrder?: number = 0;
  enabled: boolean = true;

  channels: ChannelSdo[] = [];

  constructor(collegeSdo?: CollegeSdo) {
    if (collegeSdo) {
      const channels = (collegeSdo.channels && collegeSdo.channels.map((channel) => new ChannelSdo(channel))) || [];
      const name = new PolyglotModel(collegeSdo.name);
      const description = new PolyglotModel(collegeSdo.description);
      Object.assign(this, { ...collegeSdo, name, description, channels });
    }
  }
}

decorate(CollegeSdo, {
  name: observable,
  description: observable,
  displayOrder: observable,
  enabled: observable,
  channels: observable,
});
