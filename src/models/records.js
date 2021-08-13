import mongoose from "mongoose";

const { Schema } = mongoose;

const recordSchema = new Schema({
  key: String,
  value: String, 
  createdAt: Date,
  counts: [Number],
});

recordSchema.statics.getKeyTotalCounts = (query) => {
  return Record.aggregate([
    { $match: 
      {
        createdAt: 
        {
          $gte: new Date(query.startDate),
          $lte: new Date(query.endDate)
        }
      }
    }, 
    { 
      $addFields: 
      {
        totalCounts:  {
          $reduce: {
            input: "$counts",
            initialValue: 0,
            in: { 
              $add : ["$$value", "$$this"] 
            }
          }
        }
      }
    }, 
    { 
      $match: 
      {
        totalCounts: 
        {
          $gte: query.minCount,
          $lte: query.maxCount
        }
      }
    },
    {
      $project: { 
        "_id": 0,
        "key": 1, 
        "createdAt": 1, 
        "totalCounts": 1 
      }
    }
  ]); 
}

const Record = mongoose.model('records', recordSchema);

export { Record };