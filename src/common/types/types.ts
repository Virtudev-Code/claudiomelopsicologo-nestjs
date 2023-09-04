import Patient from 'src/database/typeorm/Patient.entities';

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type IRequest = {
  user_id: string;
  day: number;
  month: number;
  year: number;
};

export type IRequestPatient = {
  user_id: string;
  month: number;
  year: number;
};

export type IResponseDay = Array<{
  hour: string;
  available: boolean;
}>;

export type IResponseMonth = Array<{
  day: number;
  available: boolean;
}>;

export type IEmail = {
  email: string;
};

export type IReset = {
  token: string;
  password: string;
};

export type CreateUserDetails = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type ValidateUserDetails = {
  username: string;
  password: string;
};

export type FindUserParams = Partial<{
  id: number;
  email: string;
  username: string;
}>;

export type FindUserOptions = Partial<{
  selectAll: boolean;
}>;

export type CreateConversationParams = {
  email: string;
  message: string;
};

export type ConversationIdentityType = 'author' | 'recipient';

export type FindParticipantParams = Partial<{
  id: number;
}>;

export interface AuthenticatedRequest extends Request {
  patient: Patient;
}

export type CreateParticipantParams = {
  id: number;
};

// export type CreateMessageResponse = {
//   message: Message;
//   conversation: Conversation;
// };

export type DeleteMessageParams = {
  userId: string;
  conversationId: string;
  messageId: string;
};

export type FindMessageParams = {
  userId: string;
  conversationId: string;
  messageId: string;
};

export type EditMessageParams = {
  conversationId: string;
  messageId: string;
  userId: string;
  content: string;
};

export type AccessParams = {
  id: string;
  userId: string;
};

export type EditGroupMessageParams = {
  groupId: number;
  messageId: number;
  userId: number;
  content: string;
};

export type CreateGroupParams = {
  creator: Patient;
  title?: string;
  users: string[];
};

export type FetchGroupsParams = {
  userId: number;
};

export type FriendRequestStatus = 'accepted' | 'pending' | 'rejected';

export type GetConversationMessagesParams = {
  id: string;
  limit: number;
};
