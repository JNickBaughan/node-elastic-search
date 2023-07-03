const data = [{
    id: 1,
    isFollowUp: true,
    isTracked: false,
    qualityRep: {
        id: 12345
    },
    deliveryRep: 14563,
    followedUpBy: null,
    trackedBy: null,
    orderDate: "2023-06-15T00:00:00",
    followedUpDate: null,
    trackedDate: null
},
{
    id: 2,
    isFollowUp: true,
    isTracked: true,
    qualityRep: {
        id: 12345
    },
    deliveryRep: 3363,
    followedUpBy: 12345,
    trackedBy: 12346,
    orderDate: "2023-06-15T00:00:00",
    followedUpDate: "2023-06-18T00:00:00",
    trackedDate: "2023-06-19T00:00:00"
}];

module.exports = data;