const express = require('express')
const cors = require('cors')
const expressGraphQL = require('express-graphql')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLList
} = require('graphql')

const app = express()

const questions = [{id: 1, text: "This is a question?", category: "javascript"},{id: 2, text: "New question?", category: "javascript"}]

const answers = [{id:1, q_id:1, text:"This is an answer to the question" }]

const QuestionType = new GraphQLObjectType({
    name: 'Question',
    description: 'Text of a question',
    fields: ()=>({
        id: {type: GraphQLNonNull(GraphQLInt)},
        text: {type: GraphQLNonNull(GraphQLString)},
        category: {type: GraphQLNonNull(GraphQLString)},
        answers: {
            type: AnswerType,
            resolve: (question)=>{
                return answers.find(ans=>ans.q_id === question.id)
            }
        }
    })
})

const AnswerType = new GraphQLObjectType({
    name: 'Answer',
    description: 'Answer to a question',
    fields: ()=>({
        id: {type: GraphQLNonNull(GraphQLInt)},
        q_id: {type: GraphQLNonNull(GraphQLInt)},
        text: {type: GraphQLNonNull(GraphQLString)}
        })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        questions: {
            type: new GraphQLList(QuestionType),
            description: 'List of questions',
            resolve: ()=> questions

        },
        answers: {
            type: new GraphQLList(AnswerType),
            description: 'List of answers',
            resolve: ()=> answers

        }
    })
})



const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addQuestion: {
            type: QuestionType,
            description: 'Add a book',
            args: {
                text: {type: GraphQLNonNull(GraphQLString)},
                category: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args) => {
                const question = {id: questions.length +1, text: args.text, category: args.category}
                questions.push(question)
                return question
            }
        },
        addAnswer: {
            type: AnswerType,
            description: 'Add an answer',
            args: {
                q_id: {type: GraphQLNonNull(GraphQLInt)},
                text: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args) => {
                const answer = {id: answers.length +1, text: args.text, q_id: args.q_id}
                answers.push(answer)
                return answer
            }
        }
    })
})


const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use(cors())
app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))

app.listen(5000, ()=>console.log('Server Running'))