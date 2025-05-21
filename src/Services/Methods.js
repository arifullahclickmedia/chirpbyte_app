import { getRequest, postRequest } from './index';

export const LoginRequest = (payload) => postRequest(`/login`,payload)
export const FCMTokenAPI = (payload) => postRequest(`/store-token`,payload)
export const ProfileRequest = () => getRequest(`/profileAPI`)
// export const GetVisitors = () => postRequest(`/getstats`)
export const GetVisitors = (payload) =>postRequest(`/livevisitors`,payload)
// export const GetVisitors = (wId) =>getRequest(`/livevisitors`,wId)
export const onlineVisitors = ({tab, page}) => getRequest(`visitorHistory?tab=${tab}&page=${page}`)
// export const onlineVisitors = () => getRequest(`/onlinevisitors`)
export const GetVisitorDetail = (payload) =>postRequest(`/lookup`,payload)
export const LogoutUser = () => postRequest(`/logout`)
export const StatebyDays = () => postRequest(`/getstatsbydays`,{days:30})
export const InboxMessages = (filterValue) => postRequest(`/get_Chats`, { f: filterValue });
export const ChatTranscripts = (session, page) => postRequest(`/gettranscripts`, { session: session, page });



export const OperatorList = () => getRequest(`/get_operator`)
export const ChatAssign = (session,operatorid) => postRequest(`/assignee`, { session: session, operatorid:operatorid });

export const ChatAssignWhatsapp = (platform,fromPhone,toPhone,operatorid) => postRequest(`/assignTo`, { platform: platform,fromPhone:fromPhone,toPhone:toPhone,op:operatorid});
export const ChatAssignInstagram = (mID,toPhone,pageId,fromPhone,operatorid) => postRequest(`/assignTo`, {mID:mID,toId:toPhone,pageId:pageId,fromId:fromPhone,platform:"insta",op:operatorid});
export const ChatAssignFacebook = (mID, toPhone, pageId, fromPhone, operatorid) => {
  const payload = { mID: mID, toId: toPhone, pageId: pageId, fromId: fromPhone, platform: "fb", op: operatorid };
  console.log('Payload in ChatAssignFacebook:', JSON.stringify(payload,null,4));
  return postRequest(`/assignTo`, payload);
};


export const ChatSolve = (session) => postRequest(`/prb_solve`, { session: session });
export const DbTranscript = (transcript_obj) => postRequest(`/insert_db_transcript`, { transcript_obj: transcript_obj });


export const GetTag = () => getRequest(`/get_tags`);
export const AddTag = (session,department) => postRequest(`/transferchat`, { session: session,department:department});
export const AddTagWhatsapp = (platform,fromPhone,toPhone,tag) => postRequest(`/add_tag`, { platform: platform,fromPhone:fromPhone,toPhone:toPhone,tag:tag});
export const AddTagInstagram = (mID,toPhone,pageId,fromPhone,type,tagId) => postRequest(`/add_tag`, {mID:mID,toId:toPhone,pageId:pageId,fromId:fromPhone,platform:"insta",tag:tagId });
export const AddTagFacebook = (mID,toPhone,pageId,fromPhone,type,tagId) => postRequest(`/add_tag`, {mID:mID,toId:toPhone,pageId:pageId,fromId:fromPhone,platform:"fb",tag:tagId });


export const ViewPage = (session) => postRequest(`/getviewedpage`, { session: session });
export const FacebookMessages = () => getRequest(`/getFacebookMessages`);
export const InstagramMessages = () => getRequest(`/getInstagramMessages`);
export const WhatsappMessages = () => getRequest(`/getWhatsappMessages`);


export const WhatsappChatTranscripts = (display_phone_number,from_phone,color,page ) => postRequest(`/getWhatsappDetails`, { 
  from_phone: display_phone_number,
  to_phone:from_phone,
  c:color,
  page
});
export const FacebookChatTranscripts = (id,to,page_id,from_id,page) => postRequest(`/getFbDetails`, {
    id:id,
    to_id:to,
    page_id:page_id,
    from_id:from_id,
    platform:"fb",
    page
  });


export const InstagramChatTranscripts = (id,to,page_id,from_id, page ) => postRequest(`/getFbDetails`, {
    id:id,
    to_id:to,
    page_id:page_id,
    from_id:from_id,
    platform:"insta",
    page
  });

  export const WhatsappSendMessage = (from_phone, display_phone_number, phone_number_id, reply) => postRequest(
    `/postDetailsWhatsapp`,
    {
      to: from_phone,                  
      from: display_phone_number,      
      phone_id: phone_number_id,       
      reply: reply                     
    }
  );
  

export const FacebookSendMessage = (from_id,access_token,page_id,reply,platform) => postRequest(`/postDetails`, {
  id:from_id,
  token:access_token,
  page_id:page_id,
  reply:reply,
  platform:platform
});

export const InstagramSendMessage = (from_id,access_token,page_id,reply) => postRequest(`/postDetails`, {
  id:from_id,
  token:access_token,
  page_id:page_id,
  reply:reply,
  platform:"insta"
});

export const WhatsappChatSolved = (msg_id,display_phone_number,fromPhone,) => postRequest(`/social_prb_solve`, {
  mID: msg_id,
  platform: "whatsapp",
  fromPhone: display_phone_number,
  toPhone: fromPhone,

});
export const FacebookChatSolved = (id,to,page_id,from_id) => postRequest(`/social_prb_solve`, {
  mID: id,
  toId: to,
  pageId: page_id,
  fromId: from_id,
  platform: "fb",
});
export const InstagramChatSolved = (id,to,page_id,from_id) => postRequest(`/social_prb_solve`, {
  mID: id,
  toId: to,
  pageId: page_id,
  fromId: from_id,
  platform: "insta",
});

export const WhatsappChatAssign = (msg_id,display_phone_number,from_phone,operatorId) => postRequest(`/assignTo`, {
  mID: msg_id,
  platform: "whatsapp",
  fromPhone: display_phone_number,
  toPhone: from_phone,
  op: operatorId
});
export const FacebookChatAssign = (id,to,page_id,from_id,operatorId) => postRequest(`/assignTo`, {
  mID: id,
  toId: to,
  pageId: page_id,
  fromId: from_id,
  platform: "fb",
  op: operatorId
});
export const InstagramChatAssign = (id,to,page_id,from_id,operatorId) => postRequest(`/assignTo`, {
  mID: id,
  toId: to,
  pageId: page_id,
  fromId: from_id,
  platform: "insta",
  op: operatorId
});

export const InstagramNewMessage = (sender_id) => postRequest(`/getInstagramMessage`, {user_id:sender_id});
export const FacebookNewMessage = (sender_id) => postRequest(`/getFacebookMessage`, {user_id:sender_id});
export const WhatsappNewMessage = (sender_id) => postRequest(`/getWhatsappMessage`, {user_id:sender_id});