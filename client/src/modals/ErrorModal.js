// @flow
import React, { Component } from 'react'
import ReactModal from 'react-modal'


// Type definitions
type Props = {
  show: boolean,
  message: string,
  onClose: Function
}

const modalStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

class ErrorModal extends Component<Props> {
  
  render () {
    const { show, message, onClose } = this.props

    return (
      <ReactModal
        isOpen={show}
        style={modalStyle}
        onRequestClose={onClose}
        shouldCloseOnOverlayClick
        shouldCloseOnEsc
        shouldFocusAfterRender
        shouldReturnFocusAfterClose
        ariaHideApp={false}
      >
        <div className='row'>
          <div className='col l8 s8 offset-l2'>
            <h4>Hmmm ...</h4>
            <p>{ message }</p>
          </div>
        </div>
        <div className='row' >
          <button
            className='btn-small waves-effect waves-light orange accent-2 right'
            onClick={onClose}
          >OK</button>
        </div>
      </ReactModal>
    )
  }
}

export default ErrorModal
