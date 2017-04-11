import React from 'react';

export function MessagePanel(props, context) {

  let message = context.messenger.getMessage();
  let messagePanel;

  if (message !== undefined) {

    messagePanel = (
      <div className={ 'alert alert-' + message.type }>
        { message.text }
      </div>
    );
    
    context.messenger.clearMessages();

  } else {

    messagePanel = (
      <div style={{ 'display': 'none' }}></div>
    );

  }

  return messagePanel;

}

MessagePanel.contextTypes = {
  messenger: React.PropTypes.object
};
