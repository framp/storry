import React from 'react';

export default class Provider extends React.Component {
  constructor(props) {
    super(props)
    this.state = props.store.state
    props.store.addListener((state) => this.setState(state)) 
  }
  render() {
    const children = React.Children.map(this.props.children, (child) => 
      React.cloneElement(child, this.state))
    return <div>{children}</div>
  }
}