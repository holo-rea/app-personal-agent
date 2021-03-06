import gql from 'graphql-tag'

export default gql`
query ($id: ID!) {
    agent (id: $id) {
      id
      name
      image
      type
      primaryLocation {
        name
      }
      email
      note
      agentSkills {
          id
          name
      }
    }
}
`
