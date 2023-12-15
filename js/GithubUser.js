export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`;

    return fetch(endpoint)
    .then(data => data.json())
    .then(({ login, name, public_repos, followers, }) => ({ // ({ login, name,... }) -> desestruturação // ({ }) same as { return { } }
      login, //: data.login,
      name, //: data.name,
      public_repos, //: data.public_repos,
      followers, //: data.followers,

      // More explicit example:
      // data => {
      //   const { login, name, public_repos, followers} = data
      //   return {
      //     login: data.login,
      //     name: data.name,
      //     public_repos: data.public_repos,
      //     followers: data.followers,
      //   }
      // }
    }))
    // .catch( e => console.log(''), e); // catch() with fetch() and .then()
  };
};