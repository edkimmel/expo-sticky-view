import * as React from 'react';

import { ExpoStickyViewProps } from './ExpoStickyView.types';

export default function ExpoStickyView(props: ExpoStickyViewProps) {
  return (
    <div style={{ position: 'sticky', top: props.topOffset, bottom: props.bottomOffset }}>
      {props.children}
    </div>
  );
}
