
async function updateStatus(parcel, status){
    parcel.status = status;
    parcel.timeline.push({status, timestamp: new Date()});
    await parcel.save();
  }

  module.exports = updateStatus;