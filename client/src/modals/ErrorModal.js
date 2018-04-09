import React, { Component } from 'react'
import ReactModal from 'react-modal'

ReactModal.setAppElement('#root')

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}
export default class ErrorModal extends Component {
  componentWillMount() {
    this.setState({dismiss:false})
  }
  render () {
    const {openModal, message} = this.props
    const display = openModal && !this.state.dismiss
    return (
      <ReactModal
        isOpen={ display }
        style={modalStyles}
      >
        <div className="row">
          <div className="col l8 s8 offset-l2">
            <h5>{message}</h5>
          </div>
        </div>
          <div className='row'>
            <button
              className='btn-small waves-effect waves-light orange accent-2 right'
              onClick={() => this.setState({dismiss: true})}
            >close</button>

        </div>

      </ReactModal>
    )
  }
}
