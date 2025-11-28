const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((max, blog) => {
        const filter = blog.likes > max.likes ? blog : max;
        const result = {
            author: filter.author,
            likes: filter.likes,
            title: filter.title
        }
        return result;
    }, blogs[0])
}

const mostBlogs = (blogs) => {
    const authorCounts = _.countBy(blogs, 'author')
    const topAuthor = _.maxBy(Object.keys(authorCounts), author => authorCounts[author]);

    return {
        author: topAuthor,
        blogs: authorCounts[topAuthor]
    }
}

const mostLikes = (blogs) => {
    const likesByAuthor = _.groupBy(blogs, 'author')

    const authorsWithTotalLikes = _.map(likesByAuthor, (authorBlogs, author) => ({
        author: author,
        likes: _.sumBy(authorBlogs, 'likes')
    }))

    return _.maxBy(authorsWithTotalLikes, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}