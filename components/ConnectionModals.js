'use strict';

import React from 'react';
import RequestTimeoutModal from './RequestTimeoutModal';
import LoadingModal from './LoadingModal';
import OfflineModal from './OfflineModal';

export default function ConnectionModals (props) {
  switch (props.connectionStatus) {
    case 'loading': return <LoadingModal {...props} />
    case 'timeout': return <RequestTimeoutModal {...props} />
    case 'offline': return <OfflineModal {...props} />
    default: return null;
  }
}
