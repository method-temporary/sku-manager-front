import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import MediaService from '../../present/logic/MediaService';
import MediaDetailView from '../view/MediaDetailView';

interface Props extends RouteComponentProps {
  mediaService?: MediaService
  structureType?: string
}

@inject('mediaService')
@observer
@reactAutobind
class MediaDetailContainer extends React.Component<Props> {
  //

  goToVideo(url: string) {
    //
    window.open(url);
  }

  render() {
    const { media } = this.props.mediaService || {} as MediaService;
    const { structureType } = this.props;

    return (
      <MediaDetailView
        media={media}
        goToVideo={this.goToVideo}
        structureType={structureType}
      />
    );
  }
}

export default withRouter(MediaDetailContainer);
