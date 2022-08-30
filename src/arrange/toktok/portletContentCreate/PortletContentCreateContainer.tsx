import React from 'react';
import { onAddCotent, onChangeDescription, onChangeImage, onChangeLinkUrl, onRemoveContent } from './portletContentCreate.events';
import { initPortletContentItems } from './portletContentCreate.models';
import { usePortletContentItems } from './portletContentCreate.stores';
import { PortletContentCreateView } from './PortletContentCreateView';

export function PortletContentCreateContainer() {
  const contentItems = usePortletContentItems() || initPortletContentItems();
  const removeDisabled = contentItems.length === 1;
  return (
    <>
      {contentItems.map(contentItem => (
        <PortletContentCreateView 
          content={contentItem}
          onChangeImage={onChangeImage}
          onChangeDescription={onChangeDescription}
          onChangeLinkUrl={onChangeLinkUrl}
          onAddContent={onAddCotent}
          onRemoveContent={onRemoveContent}
          removeDisabled={removeDisabled}
        />
      ))}
    </>
  );
}