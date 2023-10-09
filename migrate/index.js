const cassandra = require('cassandra-driver');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

function readCql(cql) {
    return fs.readFileSync(path.join(__dirname, `${cql}.cql`), 'utf8').split(';')
                                                                        .map(s => s.trim())
                                                                        .filter(s => s);
}

async function getClient() {
    const client = new cassandra.Client({
        contactPoints: [process.env.SCYLLA_HOSTS,],
        authProvider: new cassandra.auth.PlainTextAuthProvider(
            process.env.SCYLLA_USER,
            process.env.SCYLLA_PASSWD
        ),
        localDataCenter: process.env.SCYLLA_DATACENTER
    });
    await client.connect();
    return client;
}

async function main() {
    const client = await getClient();

    const SCHEMA = readCql('schema');
    const SAMPLE = readCql('sample_data');

    console.log('Creating keyspace and tables...');
    for (const query of SCHEMA) {
        await client.execute(query);
    }

    console.log('Inserting sample data...');
    for (const query of SAMPLE) {
        await client.execute(query);
    }

    console.log('Done.');
    client.shutdown()
}


main();