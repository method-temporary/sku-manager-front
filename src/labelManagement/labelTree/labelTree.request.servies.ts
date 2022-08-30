/* eslint-disable */
import { useEffect } from 'react';
import { findAllResources } from '_data/arrange/i18nResource/api/i18nResourceApi';
import { findAllResourcePaths } from '_data/arrange/i18nResourcePath/api/i18nResourcePathApi';

import { LabelNode } from './labelTree.models';
import { setLabelTree, getLabelTree } from './labelTree.services';

export async function requestLabelTree() {
  const resourcePaths = await findAllResourcePaths();

  if (resourcePaths !== undefined) {
    const parseResourcePaths = resourcePaths.map((path, i) => {
      return {
        key: path.id,
        label: `(${path.id}) ${path.name}`,
        name: path.name,
        memo: path.memo,
        nodes: [],
        isOpen: false,
      };
    });
    setLabelTree(parseResourcePaths);
  }
}

export async function requsetFindResource(i18nResourcePathId: string) {
  const resources = await findAllResources(i18nResourcePathId);

  if (resources !== undefined) {
    if (resources.empty) {
      return [];
    }

    const parseResources: LabelNode[] = resources.results.map((resource) => {
      return {
        key: resource.id,
        label: `(${resource.id}) ${resource.name}`,
        ...resource,
      };
    });

    const labelTree = getLabelTree();
    if (labelTree !== undefined) {
      const nextLabelTree = labelTree.map((c) => {
        if (c.key === i18nResourcePathId) {
          return { ...c, nodes: parseResources };
        }
        return c;
      });
      setLabelTree(nextLabelTree);
    }
  }
}

export function useRequestLabelTree() {
  useEffect(() => {
    requestLabelTree();
  }, []);
}
