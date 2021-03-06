import React, { Component } from 'react';
import Results from './Results';
import Search from './Search';
class Beer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beers: [],
      loading: true
    }
  }
  componentDidMount() {
    this.loadBeers();
  }
  componentDidUpdate(prevProps) {
    const currentSearchTerm = this.props.match.params.searchTerm;
    const oldSearchTerm = prevProps.match.params.searchTerm;
    if(currentSearchTerm !== oldSearchTerm){
      this.loadBeers(currentSearchTerm);
    }
  }
  loadBeers = (searchTerm="hops") => {
    this.setState({
      loading: true
    })
    const localStorageBeers = localStorage.getItem(`search-${searchTerm}`);
    if(localStorageBeers) {
      const localBeers = JSON.parse(localStorageBeers);
      this.setState({
        beers: localBeers,
        loading: false
      })
      return;
    }
    fetch(`http://api.react.beer/v2/search?q=${searchTerm}&type=beer`)
    .then(data => data.json())
    .then(data => {
      // fs.writeFile('./test.json', data.data, function(err) {
      //   console.log(err);
      // })
      const beers = data.data || [];
      this.setState({
        beers: beers,
        loading: false
      })
      localStorage.setItem(`search-${searchTerm}`, JSON.stringify(this.state.beers)); // 本地存储
    }).catch(err => {
      console.log(err);
    })
  }
  render() {
    return (
      <div className="wrapper">
        <Search/>
        <Results beers={this.state.beers} loading={this.state.loading}></Results>
      </div>
    );
  }
}

export default Beer;