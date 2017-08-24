import React from 'react';

import Gitlab from './../services/Gitlab';

import Header from './Header.jsx';
import Content from './Content.jsx';

class App extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    Gitlab.getGitlabData().then(data => {
      this.setState(data);
    })
  }

  render() {
    return (
      <div className="dashboard">
        <Header user={this.state.user}/>
        <Content
          projects={this.state.projects}
          commits={this.state.commits}
          user={this.state.user}
        />
      </div>
    )

  }

}

export default App;
