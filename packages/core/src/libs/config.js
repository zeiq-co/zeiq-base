const config = {
  graphQlUri:
    process.env.NEXT_PUBLIC_ENV_GRAPHQL_URI ||
    'http://localhost:3000/api/graphql',
  graphQlUriDev: 'http://localhost:3000/api/graphql',
};

export default config;
