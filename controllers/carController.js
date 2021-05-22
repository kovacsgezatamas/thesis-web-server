const axios = require('axios');
const url = require('url');

getCarsBySubscriptionId = async(req, res) => {
  const { subscriptionId } = req.params;

  const query = `PREFIX : <http://geza.com/>
    SELECT ?make ?model ?licensePlate ?productionDate ?vin ?withEngine ?isSuspended ?image
    WHERE {
      :${subscriptionId} :hasVehicle ?vehicle.

      ?vehicle :make ?makeId;
        :model ?modelId;
        :licensePlate ?licensePlate;
        :vin ?vin .

      OPTIONAL { ?vehicle :withEngine ?withEngine } .
      OPTIONAL { ?vehicle :isSuspended ?isSuspended } .
      OPTIONAL { ?vehicle :image ?image } .
      OPTIONAL { ?vehicle :productionDate ?productionDate } .

      ?makeId :hasName ?make .
      ?modelId :hasName ?model .
    }
  `;

  try {
    const params = new url.URLSearchParams({ query });

    const response = await axios.post(
      `http://localhost:8080/rdf4j-server/repositories/grafexamen`,
      params
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500);
  }
};

createCar = async(req, res) => {
  const { subscriptionId } = req.params;
  const { vin, licensePlate, make, model } = req.body;

  const checkVINQuery = `PREFIX : <http://geza.com/>
    ASK { ?carId :vin "${vin}"}`;

  const checkHasVehicleVINQuery = `PREFIX : <http://geza.com/>
    ASK { ?subscriptionId :hasVehicle :${vin}}`;

  try {
    const response1 = await axios.post(
      `http://localhost:8080/rdf4j-server/repositories/grafexamen`,
      new url.URLSearchParams({ query: checkVINQuery })
    );

    if (response1.data.boolean) {
      return res.status(400).json({
        errorCode: 'EXISTING_VIN',
      });
    }

    const response2 = await axios.post(
      `http://localhost:8080/rdf4j-server/repositories/grafexamen`,
      new url.URLSearchParams({ query: checkHasVehicleVINQuery })
    );

    if (response2.data.boolean) {
      return res.status(400).json({
        errorCode: 'EXISTING_VIN',
      });
    }
  } catch (error) {
    return res.status(500).json();
  }

  const insertCarQuery = `PREFIX : <http://geza.com/>
    INSERT DATA {
      :${subscriptionId} :hasVehicle :${vin}.
      :${vin} :make :${make};
        :model :${model};
        :licensePlate "${licensePlate}";
        :vin "${vin}".
      :${make} :hasName "${make}".
      :${model} :hasName "${model}".
    }
  `;

  try {
    await axios.post(
      `http://localhost:8080/rdf4j-server/repositories/grafexamen/statements`,
      new url.URLSearchParams({ update: insertCarQuery })
    );

    return res.status(201).json({
      ...req.body,
    });
  } catch (error) {
    return res.status(500).json();
  }
}

deleteCar = async(req, res) => {
  const { vin } = req.params;

  const deleteSubscriptionRelationQuery = `PREFIX : <http://geza.com/>
    DELETE {
      ?subscriptionId :hasVehicle ?vehicleId
    } WHERE {
      ?vehicleId :vin "${vin}" .
      ?subscriptionId :hasVehicle ?vehicleId
    }
  `;

  const deleteCarDataQuery = `PREFIX : <http://geza.com/>
    DELETE {
      ?vehicleId ?x ?y.
    }
    WHERE {
      ?vehicleId :vin "${vin}" .
      ?vehicleId ?x ?y.
    }
  `;

  try {
    await axios.post(
      `http://localhost:8080/rdf4j-server/repositories/grafexamen/statements`,
      new url.URLSearchParams({ update: deleteSubscriptionRelationQuery })
    );
    await axios.post(
      `http://localhost:8080/rdf4j-server/repositories/grafexamen/statements`,
      new url.URLSearchParams({ update: deleteCarDataQuery })
    );

    return res.status(204).json({});
  } catch (error) {
    return res.status(500).json();
  }
}

module.exports = {
  getCarsBySubscriptionId,
  createCar,
  deleteCar,
};
