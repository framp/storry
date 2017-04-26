import { h, cloneElement, Component } from 'preact';

export default class Provider extends Component {
  constructor(props) {
    super(props)
    this.state = props.store.state
    props.store.addListener((state) => this.setState(state)) 
   }
  render() {
    const children = this.props.children.map((child) => 
      cloneElement(child, this.state))
    return <div>{children}</div>
  }
}