import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";

const Record = mongoose.model('records');

const addKey = async () => {
  await new Record({
    id: mongoose.Types.ObjectId().toHexString(),
    key: "TAKwGc6Jr4i8Z487",
    createdAt: new Date('2017-01-26T03:24:00'),
    counts: [150, 160],
    value: "Getir Task"
  }).save();
}

it("fails when start date format is in DD-MM-YYYY format", () => {
    return request(app)
    .post("/api/v1/keys/totals")
    .send({
      startDate: "10-10-2017",
      endDate: "2018-02-02",
      minCount: 2700,
      maxCount: 3000,
    })
    .expect(400);
});

it("fails when start date has invalid delimeter", () => {
  return request(app)
    .post("/api/v1/keys/totals")
    .send({
      startDate: "2018/02/02",
      endDate: "2018-02-02",
      minCount: 2700,
      maxCount: 3000,
    })
    .expect(400);
});

it("fails when end date format is in YYYY-MM-DD hh:mm format", () => {
  return request(app)
    .post("/api/v1/keys/totals")
    .send({
      startDate: "2017-02-02",
      endDate: "2018-02-02 10:17",
      minCount: 2700,
      maxCount: 3000,
    })
    .expect(400);
});

it("fails when end date format is invalid", () => {
  return request(app)
      .post("/api/v1/keys/totals")
      .send({
        startDate: "2017-02-02",
        endDate: 123,
        minCount: 2700,
        maxCount: 3000,
      })
      .expect(400);
  });

  it("fails when end date is less than start date", () => {
    return request(app)
    .post("/api/v1/keys/totals")
    .send({
      startDate: "2018-02-02",
      endDate: "2016-01-26",
      minCount: 2700,
      maxCount: 3000,
    })
    .expect(400);
});

it("fails when minCount is not an integer", () => {
  return request(app)
      .post("/api/v1/keys/totals")
      .send({
        startDate: "2017-02-02",
        endDate: "2018-02-02",
        minCount: "aaa",
        maxCount: 3000,
      })
      .expect(400);
  });

  it("fails when minCount is less than 0", () => {
    return request(app)
      .post("/api/v1/keys/totals")
      .send({
        startDate: "2017-02-02",
        endDate: "2018-02-02",
        minCount: -1,
        maxCount: 3000,
      })
      .expect(400);
  });

  it("fails when maxCount is not an integer", () => {
    return request(app)
      .post("/api/v1/keys/totals")
      .send({
        startDate: "2017-02-02",
        endDate: "2018-02-02",
        minCount: 2700,
        maxCount: true,
      })
      .expect(400);
  });

  it("fails when maxCount is less than 0", () => {
    return request(app)
      .post("/api/v1/keys/totals")
      .send({
        startDate: "2017-02-02",
        endDate: "2018-02-02",
        minCount: 2700,
        maxCount: -1,
      })
      .expect(400);
  }); 

  it("fails when maxCount is less than minCount", async () => {
    const response = await request(app)
      .post("/api/v1/keys/totals")
      .send({
        startDate: "2017-02-02",
        endDate: "2018-02-02",
        minCount: 2700,
        maxCount: 1000,
      })
    .expect(400);

    expect(response.body.code).toEqual(400);
    expect(response.body.msg).toEqual("maxCount must be greater than or equal to minCount.");
  });

  it("returns 200 if minCount is an integer sent as string", () => {
    return request(app)
      .post("/api/v1/keys/totals")
      .send({
        startDate: "2016-01-26",
        endDate: "2018-02-02",
        minCount: "100",
        maxCount: 3000,
      })
      .expect(200);
  });

  it("returns 200 if maxCount is an integer sent as string", () => {
    return request(app)
      .post("/api/v1/keys/totals")
      .send({
        startDate: "2016-01-26",
        endDate: "2018-02-02",
        minCount: 100,
        maxCount: "3000",
      })
      .expect(200);
  });

it("returns 200 if parameters are correct", () => {
  return request(app)
    .post("/api/v1/keys/totals")
    .send({
      startDate: "2016-01-26",
      endDate: "2018-02-02",
      minCount: 0,
      maxCount: 3000,
    })
    .expect(200);
}); 


it("returns success with filtered records if parameters are correct", async () => {
  await addKey();

  const response = await request(app)
    .post("/api/v1/keys/totals")
    .send({
      startDate: "2016-01-26",
      endDate: "2018-02-02",
      minCount: 0,
      maxCount: 3000,
    })
    .expect(200);


    const expectedRecords = [
      {
        key: 'TAKwGc6Jr4i8Z487',
        createdAt: '2017-01-26T00:24:00.000Z',
        totalCounts: 310
      }
    ];
    
    expect(response.body.code).toEqual(0);
    expect(response.body.msg).toEqual("Success");
    expect(response.body.records).toEqual(expectedRecords);
});

it("returns success with empty records if no record matches", async () => {
  const response = await request(app)
    .post("/api/v1/keys/totals")
    .send({
      startDate: "1900-01-26",
      endDate: "1901-02-02",
      minCount: 0,
      maxCount: 3000,
    })
    .expect(200);
    
    expect(response.body.code).toEqual(0);
    expect(response.body.msg).toEqual("Success");
    expect(response.body.records).toEqual([]);
});
