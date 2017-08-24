import React from 'react';

// <div className='authors'>
//   <div
//     className={`author ${this.state.activeAuthorName === 'all' ? 'active' : ''}`}
//     key={'all'}
//     onClick={() => this.handleAuthorClick('all')}
//   >
//     All
//   </div>
//   {getAuthors(this.props.commits).map(author =>
//     <div
//       className={`author ${this.state.activeAuthorName === author ? 'active' : ''}`}
//       key={author}
//       onClick={() => this.handleAuthorClick(author)}
//     >
//       {author}
//     </div>)}
//
// </div>

const padLeft = (nr, n, str) => {
    return Array(n-String(nr).length+1).join(str||'0')+nr;
}

const formatDate = date => {
  const day = date.split('-')[2].split('T')[0];
  const month = date.split('-')[1];
  const time = date.split('T')[1].split('.000')[0]


  return `${day}-${month} ${time.split(':')[0]}:${time.split(':')[1]}`
}

const getAuthors = commits =>
  Array.from(new Set(commits.map(({author_name}) => author_name)))
  .sort( (a, b) => (a < b) ? -1 : ((a > b) ? 1 : 0));

class Commits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {activeAuthorName: 'Remco Peggeman'};
  }

  commitFilter(commit) {
    if(this.state.activeAuthorName === 'all') return true;
    return commit.author_name === this.state.activeAuthorName;
  }

  handleAuthorClick(author) {
    this.setState({activeAuthorName: author});
  }

  projectNames() {
    return Array.from(new Set(
      this.props.commits.filter( commit => this.commitFilter(commit)).map(({projectId}) => this.props.projects.find(project => project.id === projectId).name)
    ))
  }

  render(){
    return(
      <div className='commits'>
        <div> You worked on: <span className='thin'> {this.projectNames().join(', ')} </span></div>
        <br />
        { this.props.commits
            .sort( (a, b) => (a.created_at < b.created_at) ? 1 : ((a.created_at > b.created_at) ? -1 : 0))
            .filter( commit => this.commitFilter(commit))
            .map( commit =>
                <div className='commit' key={commit.id}>
                  <div className="ultra-thin date">{formatDate(commit.created_at)}
                  </div>
                  <div className="description">
                    <span> {this.props.projects.find(project => project.id === commit.projectId).name} </span>
                    <span className="thin"> {commit.title} </span>
                  </div>
                </div>
        )}
      </div>
    )
  }

}

export default Commits;
