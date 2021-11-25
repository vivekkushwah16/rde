export const OPERATION_TYPE = {
  Ready: "Ready",
  RequestAccess: "RequestAccess",
  CancelAccessRequest: "CancelAccessRequest",
  GiveAccess: "GiveAccess",
  RevokeAccess: "RevokeAccess",
  GetAccessList: "GetAccessList",
  accessUpdate: "accessUpdate", // for client from server only
  accesslist: "accesslist", // for client from server only
  error: "error",
  updateHandRaisedStatus: "updateHandRaisedStatus",
  updateCallStartedStatus: "updateCallStartedStatus",
  videocallRoomDetails: "videocallRoomDetails",
};
