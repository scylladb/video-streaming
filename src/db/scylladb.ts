
export async function getScyllaDBCluster() {
    const cassandra = require('cassandra-driver')
    return new cassandra.Client({
      contactPoints: [process.env.SCYLLA_HOSTS, ],
      localDataCenter: process.env.SCYLLA_DATACENTER,
      credentials: { username: process.env.SCYLLA_USER, password: process.env.SCYLLA_PASSWD },
      keyspace: process.env.SCYLLA_KEYSPACE
    })
}
