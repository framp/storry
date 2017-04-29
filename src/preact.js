import { h, cloneElement, Component } from 'preact'

export default class Provider extends Component {
  constructor(props) {
    super(props)
    this.state = props.store.state
    props.store.listen(this.setState.bind(this))
   }
  render() {
    const children = this.props.children.map((child) => 
      cloneElement(child, this.state))
    return h('div', null, ...children)
  }
}