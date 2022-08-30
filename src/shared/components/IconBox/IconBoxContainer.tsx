import React from 'react';
import { IconModel } from '../../model/IconModel';
import { Icon, List, Segment, Image } from 'semantic-ui-react';

interface Props {
  //
  value: string;
  icons: IconModel[];
  options?: any;
  readonly?: boolean;
  customSelector?: (selectedId: string, imageId: string) => any;
  onSelectIcon: (icon: IconModel) => void;
}

class IconBoxContainer extends React.Component<Props> {
  //
  render() {
    const { icons, value, options, customSelector, onSelectIcon } = this.props;
    //
    return (
      <div className="depot-image-box">
        <Segment attached>
          <div className="preview-list">
            <List horizontal>
              {icons.map((icon, index) => (
                <IconBoxListView
                  key={index}
                  icon={icon}
                  value={value}
                  options={options}
                  onSelectIcon={onSelectIcon}
                  customSelector={customSelector}
                />
              ))}
            </List>
          </div>
        </Segment>
      </div>
    );
  }
}

interface ViewProps {
  //
  icon: IconModel;
  value: string;
  options?: any;
  onSelectIcon: (icon: IconModel) => void;
  customSelector?: (selectedId: string, imageId: string) => any;
}

class IconBoxListView extends React.Component<ViewProps> {
  //
  render() {
    //
    const { icon, value, options, onSelectIcon, customSelector } = this.props;

    return (
      <List.Item
        as={options && options.selectable ? 'a' : ''}
        key={icon.fileUri}
        onClick={() => (options && options.selectable ? onSelectIcon(icon) : {})}
      >
        <List.Content>
          <Image
            className="preview"
            src={`${(options && options.baseUrl) || ''}${icon.fileUri}`}
            centered
            width={options && options.width}
            height={options && options.height}
          />
          {customSelector
            ? customSelector(value, icon.fileUri)
            : value === icon.fileUri && <Icon name="check circle outline" size="huge" color="teal" />}
        </List.Content>
      </List.Item>
    );
  }
}

export default IconBoxContainer;
