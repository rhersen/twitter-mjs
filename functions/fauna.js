/* eslint-disable no-undef */
const faunadb = require("faunadb");

const q = faunadb.query;

const faunaClient = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
});

function lastRead() {
  return faunaClient.query(q.Get(q.Match(q.Index("all_last_read"))));
}

function mark(ref, id_str) {
  return faunaClient.query(q.Replace(ref, { data: { id_str } }));
}

exports.handler = async function ({ httpMethod, body }) {
  console.log(httpMethod, body);
  try {
    if (httpMethod === "GET") {
      const response = await lastRead();
      console.log(response);
      if (!response.data)
        return { statusCode: response.requestResult.statusCode };

      return {
        statusCode: 200,
        body: JSON.stringify(response.data)
      };
    }

    if (httpMethod === "PUT") {
      const { ref } = await lastRead();
      const { ts } = await mark(ref, body);
      console.log("PUT ok at", Date(ts));
      return {
        statusCode: 200,
        body: "ok"
      };
    }
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: err.requestResult ? err.requestResult.statusCode : 500,
      body: err.message // Could be a custom message or object i.e.
    };
  }
};
