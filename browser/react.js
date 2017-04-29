var Provider = (function (_super) {
  var __extends = function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]
    function __() { this.constructor = d }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __())
  }
  __extends(Provider, _super)
  function Provider(props) {
    _super.call(this, props)
    this.state = props.store.state
    window.state = this.state
    props.store.on('change', this.setState.bind(this))
    props.store.on('error', console.error.bind(console))
  }
  Provider.prototype.render = function () {
    var _this = this
    var children = React.Children.map(this.props.children, function (child) {
      return React.cloneElement(child, _this.state)
    })
    return React.createElement.apply(null, ['div', null].concat(children))
  }
  return Provider
}(React.Component))
