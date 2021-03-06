import React, {Component} from 'react';
import PropTypes from 'prop-types'

class Single extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  searchRef = React.createRef();
  handleSubmit = (e) => {
    e.preventDefault();
    var searchTerm = this.searchRef.current.value;
    this.context.router.history.push(`/search/${searchTerm}`);
  }
  render() {
    return (
      <div className="search">
        <form onSubmit={this.handleSubmit}>
          <input type="text" ref={this.searchRef} placeholder="Hoppy, Malt, Angry, New..."/>
          <input type="submit" value="Search"/>
        </form>
      </div>
    );
  }

}

export default Single;