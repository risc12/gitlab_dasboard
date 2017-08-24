import React from 'react';

const Projects = props =>
  <div className='projects'>
    { props.projects
        .filter(project => !project.archived)
        .sort((a, b) => a.id - b.id)
        .map( project =>
          <div className='project' key={project.id}>
            {project.id} <span className='thin'> {project.name} </span>
          </div>
    )}
  </div>

export default Projects;
