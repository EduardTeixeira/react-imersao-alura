import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades) {
  return (
    <Box as='aside'>
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(propriedades) {
  console.log(propriedades)
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
    </h2>
      {/*
      <ul>
        {propriedades.items.map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={`/users/${itemAtual.title}`}>
                <img src={`https://picsum.photos/200/300?random=${itemAtual.image}`} />
                <span>{itemAtual.title}</span>
              </a>
            </li>
          )
        })}
      </ul>
       */}
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {

  const gitUser = 'EduardTeixeira';

  const [comunidades, setComunidades] = React.useState([]);
  // const comunidades = comunidades[0];
  // const alteradorDeComunidades/setComunidades = comunidades[1];

  // const comunidades = ['AluraKut'];

  const meusAmigos = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ];

  const [seguidores, setSeguidores] = React.useState([]);
  React.useEffect(() => {

    fetch('https://api.github.com/users/EduardTeixeira/followers')
      .then((responseServer) => {
        console.log(responseServer);
        if (responseServer.ok) {
          return responseServer.json();
        }
        throw new Error('Error >>> ' + responseServer.status);
      })
      .then((responseBody) => {
        setSeguidores(responseBody);
      })

    // API GraphQL
    fetch(
      'https://graphql.datocms.com/',
      {
        method: 'POST',
        headers: {
          'Authorization': '30e1acd841a7897f49ad280c959736',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(
          {
            "query": `query { 
              allCommunities {
                id
                title
                creatorSlug
                imageUrl
              }
            }`
          }
        ),
      }
    )
      .then((responseServer) => {
        console.log('GraphQL')
        console.log(responseServer);
        if (responseServer.ok) {
          return responseServer.json();
        }
        throw new Error('Error >>> ' + responseServer.status);
      })
      .then((responseBody) => {
        console.log('graph body')
        console.log(responseBody)
        const comunidadesDato = responseBody.data.allCommunities;
        setComunidades(comunidadesDato);
      })

  }, [])

  return (
    <>

      <AlurakutMenu githubUser={gitUser} />

      <MainGrid>

        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={gitUser} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>

          <Box>
            <h1 className="title">
              Bem vindo(a)
            </h1>
            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={() => {

              event.preventDefault();

              const dadosForm = new FormData(event.target);

              const comunidade = {
                title: dadosForm.get('title'),
                imageUrl: 'https://picsum.photos/200/300?random=' + dadosForm.get('image'),
                creatorSlug: gitUser,
              }

              fetch(
                '/api/comunidades',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                  },
                  body: JSON.stringify(comunidade),
                }
              ).then(async (response) => {
                const dados = await response.json();
                console.log(dados.registroCriado);
                const comunidade = dados.registroCriado;
                const comunidadesAtualizadas = [...comunidades, comunidade];
                setComunidades(comunidadesAtualizadas);
              })

            }}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
                <input
                  placeholder="Informe um valor, iremos gerar a imagem automaticamente para usarmos de capa"
                  name="image"
                  aria-label="Informe um valor, iremos gerar a imagem automaticamente para usarmos de capa"
                />
              </div>
              <button>
                Criar comunidade
              </button>
            </form>
          </Box>

        </div>

        <div className="relationsArea" style={{ gridArea: 'relationsArea' }}>

          <ProfileRelationsBox title='Seguidores' items={seguidores} />

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Meus amigos ({meusAmigos.length})
            </h2>
            <ul>
              {meusAmigos.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`} key={itemAtual}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

        </div>

      </MainGrid>

    </>
  )
}
