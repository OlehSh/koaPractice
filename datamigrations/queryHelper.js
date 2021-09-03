module.exports = {
  replaceWithUuid: (uuid, id, dataArr) => {
    const index = dataArr.indexOf(id)
    if (index !== -1) {
      dataArr.splice(index, 1, uuid);
    }
    return dataArr
  },
  getOneWayRelationQuery: (node, nodeLabel, relationLabel, tx) => node.from.map((fromId => {
    return node.to.map(toId => {
      const params = { fromId, toId }
      const query = `MATCH (n:${nodeLabel} { id: $fromId }), (m:${nodeLabel} { id: $toId }) CREATE (n)-[r:${relationLabel}]->(m)`
      return tx.run(query, params)
    })
  })),
  getTwoWayRelationQuery: (node, nodeLabel, relationLabel, tx) => {
    return node[ 0 ].map((firstId) => {
      if (node[ 1 ][ 0 ] !== 0) {
        return node[ 1 ].map(secondId => {
          const query = `MATCH (n:${nodeLabel} {id: $firstId }), (m:${nodeLabel} { id: $secondId }) CREATE (n)-[r_out:${relationLabel}]->(m) CREATE (m)-[r_in:${relationLabel}]->(n)`
          return tx.run(query, { firstId, secondId })
        })
      }
  
      const arrIds = node[ 0 ].filter(person => person !== firstId)
      const query = `MATCH (n:${nodeLabel} {id: $firstId }), (m:${nodeLabel}) WHERE m.id IN ["${ arrIds.toString().replace(/,/g, '","')}"] CREATE (n)-[r_out:${relationLabel}]->(m)`
      return tx.run(query, { firstId, inIds: arrIds.toString() })
    })
  }
}