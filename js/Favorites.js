import { GithubUser } from "./GithubUser.js";

// Classes e Herança

// Classe que vai conter a lógica dos dados // Como os dados serão estruturados
// root == id="app"
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();

    // GithubUser.search('leoz2s')
    // .then(user => console.log(user));
  };

  // Creating an asyncronous function
  // When it reaches an await, the function will await the process be finished to continue. (Just like it happens with fetch() and .then()).
  // It awaits the asyncronous part (the promise) to finish.
  // For it being asyncronous it cans be considered a Promise as well, so it's possible to use .then() after the execution of this function.
  async add(username) {
    try {
      // Validação de usuário já existente não funciona quando o usuário possui letras maiúsculas e a busca foi feita com letras minúsculas.
      // Letras maiúsculas e minúsculas neutralizadas para que não seja levado em consideração na comparação.
      const neutralizedUsername = username.toLowerCase();

      // .find() -> high-order function (nos arrays) -> Recebe ou retorna funções como argumento.
      // If it finds, it'll be boolen value true, returning an object. Else, false and won't return an object.
      const userExists = this.entries.find(entry => entry.login.toLowerCase()  === neutralizedUsername); 

      // console.log(this.entries);
      // console.log(userExists);
      if(userExists) {
        throw new Error('Usuário já cadastrado.');
      };

      // GithubUser.search(username).then(data => "Continue") // Como eliminar o .then():
      const user = await GithubUser.search(username); // await -> Espera de uma promessa (Só funciona se a função for async)
      
      if(user.login === undefined) {
        throw new Error('Usuário não encontrado');
         // Create an error object // throw looks forward to the next catch(){} and pass the created object as argunment for catch()
      };

      // this.entries.push(user); // Breaks the imutabillity principle
      this.entries = [user, ...this.entries];
      this.update();
      this.save();

    } catch(error) {
      alert(error.message);
    };
  };

  load() {
    console.log(JSON.parse(localStorage.getItem('@github-favorites:')));
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [];
    // console.log(this.entries);
    
    // this.entries = [
    //   {
    //     login: 'leoz2s',
    //     name: "Leonardo",
    //     public_repos: '11',
    //     followers: '1',
    //   },
    //   {
    //     login: 'maykbrito',
    //     name: "Mayk Brito",
    //     public_repos: '76',
    //     followers: '12000',
    //   },
    //   {
    //     login: 'diego3g',
    //     name: "Diego",
    //     public_repos: '106',
    //     followers: '1100',
    //   }
    // ];
    
    // this.entries = entries;
  };

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries));
    // JSON.stringify() -> Transforms the object in JS to an object in .json as a string
  }

  delete(user) {
    const filteredEntries = this.entries
      .filter(entry => entry.login !== user.login);
    
    this.entries = filteredEntries;
    this.update();
    this.save();

    // console.log(filteredEntries) // {return true;} -> [0, 1] // {return false;} -> []
    // Higher-order functions (map, filter, find, reduce)
  };
};

// Classe que vai criar a visualização e eventos do HTML (DOM) // Construir tabela
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root); // Criando o link entre as duas classes. Fazendo uma cópia aqui da outra classe.
    // A linha super(root) (root que é chamado do constructor) vai buscar do extends o constructor e copiar o this.root
    //console.log(this.root);

    this.tbody = this.root.querySelector('table tbody');

    this.update();
    this.onadd();
  };

  onadd() {
    const addButton = this.root.querySelector('.search button');
    addButton.onclick = () => {
      const {value} = this.root.querySelector('.search input');
      // console.log(input);
      // console.dir(input); // console.dir() -> Mostra no console o elemento como um objeto // Ver propriedades e funcionalidades
      // console.log(value);

      this.add(value);
    }
  }

  update() {
    this.removeAllTr();
    
    this.entries.forEach( user => {
      // console.log(user);
      const row = this.createRow();
      // console.log(row)

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`;
      row.querySelector('.user img').alt = `Imagem de ${user.name}`;
      row.querySelector('.user a').href = `https://github.com/${user.name}`;
      row.querySelector('.user p').textContent = user.name;
      row.querySelector('.user span').textContent = user.login;
      row.querySelector('.repositories').textContent = user.public_repos;
      row.querySelector('.followers').textContent = user.followers;
      
      this.tbody.append(row);
      // Funcionalidade da DOM // Recebe um elemento HTML da DOM (não é HTML puro)

      row.querySelector('.remove').onclick = () => {
        const isTrue = confirm('Tem certeza que deseja deletar esse usuário de seus favoritos?')
        if(isTrue) {
          this.delete(user);
        };
      };
    });
  }

  createRow() {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/leoz2s.png" alt="Imagem de leoz2s">
        <a href="https://github.com/leoz2s" target="_blank">
          <p>Leonardo</p>
          <span>leoz2s</span>
        </a>
      </td>

      <td class="repositories">
        76
      </td>

      <td class="followers">
        9589
      </td>

      <td class="button">
        <button class="remove">&times;</button>
      </td>
    `;

    return tr;
  };

  removeAllTr() {
    this.tbody.querySelectorAll('tr')
      .forEach((tr) => {tr.remove()}); 
    // tbody.querySelectorAll('tr') -> Node List (array like) -> Muito semelhante a estrutura de um Array. E possui diversos métodos de array.
    // .forEach(() => {}) -> Para cade elemento executa a função.
    // .remove() -> Remove o elemento.
  };
};
