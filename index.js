import { Feed } from 'feed';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  // Atom one is buggy for now
  // const pathRegex = /\/([^/]+)\.(rss|atom|json)/i;
  const pathRegex = /\/([^/]+)\.(rss|json)/i;
  const [_, username, format] = url.pathname.match(pathRegex) || [];
  if (format) {
    const response = await fetch(
      `https://api.github.com/users/${username}/starred`,
      {
        headers: {
          Accept: 'Accept: application/vnd.github.v3+json',
          'User-Agent': 'gh-starred-repos-feed/1.0',
        },
        cf: {
          cacheTtl: 300,
          cacheEverything: true,
        },
      },
    );
    const json = await response.json();
    const feed = new Feed({
      title: `${username}'s starred repos on GitHub`,
      description: `A feed of ${username}'s starred repos on GitHub`,
      link: `https://github.com/stars/${username}/`,
      generator: 'gh-starred-repos-feed/1.0',
    });
    json.forEach(repo => {
      feed.addItem({
        title: repo.name,
        id: repo.id,
        link: repo.html_url,
        description: repo.description,
        content: `<p>${repo.description}</p><p>⭐ ${repo.stargazers_count} 🔱 ${repo.forks_count}</p>`,
        date: new Date(), // always latest
        author: [
          {
            name: repo.owner.login,
            link: repo.owner.html_url,
          },
        ],
      });
    });
    const feedMapping = {
      rss: {
        type: 'application/rss+xml',
        fn: 'rss2',
      },
      // atom: {
      //   type: 'application/atom+xml',
      //   fn: 'atom1',
      // },
      json: {
        type: 'application/json',
        fn: 'json1',
      },
    };
    const feedResponse = feed[feedMapping[format].fn]();
    return new Response(feedResponse, {
      headers: {
        'content-type': `${feedMapping[format].type}; charset=utf-8`,
        'cache-control': 'public, max-age=300, s-maxage=300',
      },
    });
  }

  if (url.pathname === '/') {
    return new Response(
      'Check out the repo: https://github.com/cheeaun/gh-starred-repos-feed',
    );
  }

  return new Response('Page not found', {
    status: 404,
  });
}
