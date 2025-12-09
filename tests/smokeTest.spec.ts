import { test } from '../utils/fixtures';
import { expect } from '../utils/custom-expect';
import { APILogger } from '../utils/logger';

let authToken: string
test.beforeAll('Get auth token', async ({api}) => {
    const tokenResponse = await api
    .path('/users/login')
    .body({user: {email: "haj642430@abv.bg", password: "parola123"}})
    .postRequest(200);

    authToken = 'Token ' + tokenResponse.user.token;
})

test('logger', async () => {
    const logger = new APILogger()
    logger.logRequest('GET', 'https://test.com/api', {Authorization: 'token'}, {foo: 'bar'})
    logger.logResponse(200, {foo: 'bar'});
    const logs = logger.getRecentLogs();
    console.log(logs);
})

test('first GET test', async ({ api }) => {

    const response = await 
    api
    .path('/articles')
    .params({limit:10, offset:0})
    .getRequest(200);

     expect(response.articles.length).shouldBeLessThanOrEqual(10);
     expect(response.articlesCount).shouldEqual(10);
})


test('GET test tags', async ({ api }) => {
    const response = await api
    .path('/tags')
    .getRequest(200);

    expect(response.tags[0]).shouldEqual('Test');
    expect(response.tags.length).shouldBeLessThanOrEqual(10);
    console.log(response)
});

test('Create,Get, Delete, Get article', async ({ api }) => {
    const createArticleResponse = await api
    .path('/articles')
    .headers({Authorization: authToken})
    .body({
        "article": {
        "title": "I am API created articleeeeeee", 
        "description": "API created article woohoooo", 
        "body": " I am an API Body wohooooooo", 
        "tagList": ["api","test"]}})
    .postRequest(201);

    expect(createArticleResponse.article.title).shouldEqual("I am API created articleeeeeee");
    const slugId = createArticleResponse.article.slug;


    const articlesResponse = await api
    .path('/articles')
    .headers({Authorization: authToken})
    .params({limit:10, offset:0})
    .getRequest(200);

    expect(articlesResponse.articles[0].title).shouldEqual("I am API created articleeeeeee");

    await api
    .path(`/articles/${slugId}`)
    .headers({Authorization: authToken})
    .deleteRequest(204);

    const articlesResponse2 = await api
    .path('/articles')
    .headers({Authorization: authToken})
    .params({limit:10, offset:0})
    .getRequest(200);

    expect(articlesResponse2.articles[0].title).not.shouldEqual("I am API created articleeeeeee");
    console.log(articlesResponse2.articles[0].title);
})

test('Create, UPdate and Delete article', async ({ api }) => {
    
    //Thought by Stoycho
    // You can consider each api operation as a separate test step. e.g create articles, update article, , get article, delete article all those are steps ^^ :) by using the request handler and fixtures it is way easier to read and maintain.

    const createArticleResponse = await api
    .path('/articles')
    .headers({Authorization: authToken})
    .body({
        "article": {
        "title": "I am an API PUT created article", 
        "description": "API created PUT article woohoooo", 
        "body": " I am an API Body wohooooooo", 
        "tagList": ["api","test"]}})
    .postRequest(201);

    expect(createArticleResponse.article.title).shouldEqual("I am an API PUT created article");
    const slugId = createArticleResponse.article.slug;

    const updateArticleResponse =  await api
    .path(`/articles/${slugId}`)
    .headers({Authorization: authToken})
    .body({
        "article": {
        "title": "I am an API PUT updated created article", 
        "description": "API updated PUT article woohoooo", 
        "body": " I am an ssAPI Body wohooooooo", 
        "tagList": ["api","test"]}})
    .putRequest(200);

    expect(updateArticleResponse.article.title).shouldEqual("I am an API PUT updated created article");
    const newSlugId = updateArticleResponse.article.slug;

    const articlesResponse = await api
    .path('/articles')
    .headers({Authorization: authToken})
    .params({limit:10, offset:0})
    .getRequest(200);

    expect(articlesResponse.articles[0].title).shouldEqual("I am an API PUT updated created article");

    await api
    .path(`/articles/${newSlugId}`)
    .headers({Authorization: authToken})
    .deleteRequest(204);

    const articlesResponse2 = await api
    .path('/articles')
    .headers({Authorization: authToken})
    .params({limit:10, offset:0})
    .getRequest(200);

    expect(articlesResponse2.articles[0].title).not.shouldEqual("I am an API PUT updated created article");
    console.log(articlesResponse2.articles[0].title);
})