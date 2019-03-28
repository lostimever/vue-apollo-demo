import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'

const httpLink = new HttpLink({
  uri: 'https://api.graph.cool/simple/v1/cj1jvw20v3n310152sv0sirl7'
})

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
  connectToDevTools: true,
})

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
	defaultClient: apolloClient,
})

export default apolloProvider