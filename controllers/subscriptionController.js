const axios = require('axios');
const url = require('url');

getSubscriptions = async(req, res) => {
  try {
    const params = new url.URLSearchParams({
      query: `PREFIX : <http://geza.com/>
        SELECT *
        WHERE {?id a :Subscription; :hasName ?name; :isPerson ?isPerson}`
    });

    const response = await axios.post(
      `http://localhost:8080/rdf4j-server/repositories/grafexamen`,
      params
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500);
  }
}

module.exports = {
  getSubscriptions,
};
