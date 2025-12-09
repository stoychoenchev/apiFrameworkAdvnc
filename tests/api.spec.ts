import {test, expect} from '@playwright/test';



test('Api tests', async ({request}) => {
const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags');
const tagsResponseJSON = await tagsResponse.json();


expect(tagsResponse.status()).toEqual(200);
expect(tagsResponseJSON.tags[0]).toEqual('Test');
expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10);
console.log(tagsResponseJSON);
});


test('Get all articles', async ({request}) => {
const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0');
const articlesResponseJSON = await articlesResponse.json();


expect(articlesResponseJSON.articles.length).toBeLessThanOrEqual(10);
expect(articlesResponse.status()).toEqual(200);
expect(articlesResponseJSON.articlesCount).toEqual(10);
console.log(articlesResponseJSON);
});



test('Create article', async ({request}) => {

const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {user: {email: "haj642430@abv.bg", password: "parola123"}
}})
const tokenResponseJSON = await tokenResponse.json();
const authToken = await tokenResponseJSON.user.token
console.log(tokenResponseJSON);
console.log(authToken);


const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
data: {
    "article": {
        "title": "Triene", 
        "description": "about apis", 
        "body": "bababababba", 
        "tagList": ["api","test"]
    }
    }
,
headers: {
    Authorization: `Token ${authToken}`
}})

const newArticleResponseJSON = await newArticleResponse.json();
console.log(newArticleResponseJSON);
expect(newArticleResponse.status()).toEqual(201);
expect(newArticleResponseJSON.article.title).toEqual("Triene");

const slugId = newArticleResponseJSON.article.slug;

const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',
    {
        headers: {
            Authorization: `Token ${authToken}`
        }
    }
)

const articlesResponseJSON = await articlesResponse.json();
expect(articlesResponseJSON.articles[0].title).toEqual("Triene");

const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`,
    {
        headers: { 
            Authorization: `Token ${authToken}`
        }
    }
);

expect(deleteArticleResponse.status()).toEqual(204);



});

