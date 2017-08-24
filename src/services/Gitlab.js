import store from 'store';
window.store = store;

import GitlabSecrets from './GitlabSecrets';

const yesterdayISOString = () => {
  const yesterday = new Date(new Date().setDate(new Date().getDate()-1));
  yesterday.setHours(0,0);
  yesterday.setMinutes(0,0);
  yesterday.setSeconds(0,0);

  return yesterday.toISOString();
}

class Gitlab {
  static async getGitlabData() {
    const gitlabData = store.get(yesterdayISOString());


    if(typeof gitlabData !== 'undefined') {
      console.log('gitlabData from store: ', gitlabData);
      return gitlabData;
    }

    console.log('gitlabData not in store, fetching...');

    const fetchedData = await Gitlab.fetchGitlabData();
    console.log(fetchedData);
    store.set(yesterdayISOString(), fetchedData);

    return fetchedData;
  }

  static async fetchGitlabData() {
    const [user, projects] = await Promise.all([Gitlab.user(), Gitlab.projects()]);
    const commits = await Gitlab.commitsOf(projects);

    return {projects, commits, user};
  }

  static async user() {
    return fetch(`${Gitlab.url}/user?private_token=${Gitlab.token}`)
      .then(res => res.json());
  }

  static async commitsOf(projects) {
    const projectIds = projects.map(({id}) => id)
    const projectUrl = projectId => `${Gitlab.url}/projects/${projectId}`;

    const queryParams = () =>
      `?private_token=${Gitlab.token}&per_page=100&since=${yesterdayISOString()}`;

    const commitsUrl = projectId => `${projectUrl(projectId)}/repository/commits${queryParams()}`;

    const promises = projects.map( project =>
      fetch(commitsUrl(project.id)).then( res => res.json()));

    return Promise.all(promises).then(responses => {
      let commitArray = [];
      responses.forEach((response, index) => {
        commitArray = commitArray.concat(response.map(commit => (Object.assign({}, commit, {projectId: projectIds[index]}))));
      })
      return commitArray;
    });
  }

  static async projects() {
    const projectUrl = page =>
      `${Gitlab.url}/projects?private_token=${Gitlab.token}&per_page=100&page=${page}`;

    const promises = [
      fetch(projectUrl(1)).then(res => res.json()),
      fetch(projectUrl(2)).then(res => res.json()),
      fetch(projectUrl(3)).then(res => res.json()),
      fetch(projectUrl(4)).then(res => res.json()),
    ];

    return Promise.all(promises).then(projects =>
      [...projects[0],
       ...projects[1],
       ...projects[2],
       ...projects[3]
     ]
    );
  }
}

Gitlab.token = GitlabSecrets.token;
Gitlab.url = GitlabSecrets.url;

export default Gitlab;
