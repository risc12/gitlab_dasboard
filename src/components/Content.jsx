import React from 'react';

import Projects from './Projects.jsx';
import Commits from './Commits.jsx';

const Content = props =>
  <div>
    <div className="projects-wrapper">
      { props.projects ?
          <Projects projects={props.projects} />
        : null
      }
    </div>
    <div className="commits-wrapper">
      { props.commits ?
          <Commits commits={props.commits} projects={props.projects} />
        : null
      }
    </div>
  </div>

export default Content;
