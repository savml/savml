
// structs
/**
 * Sex
 * 动物性别
 */
export enum Sex {
  /**
   * Sex.Male 男
   */
  Male = 0,
  /**
   * Sex.Female 女
   * 磁性动物
   */
  Female = '1',
}

/**
 * UserInfo
 */
export interface UserInfo {
  /**
   * email 
   */
  email : boolean;
}

// buildin structs
/**
 * AccountProfileRequest
 */
export interface AccountProfileRequest {
  /**
   * userName 
   */
  userName : string;
  /**
   * sex 
   */
  sex : Sex;
}

/**
 * AuthSignupResponse
 */
export interface AuthSignupResponse {
  /**
   * userId 用户ID
   * 用户身份唯一标记
   */
  userId : number;
  /**
   * sexs 
   */
  sexs : Sex[];
}

// services
/**
 * Account
 */
export interface Account {
  /**
   * Profile
   * @param input AccountProfileRequest
   */
  Profile(input: AccountProfileRequest): Promise<void>;
}

/**
 * Auth
 * 认证服务
 */
export interface Auth {
  /**
   * Login
   * 用户登陆
   * @param input UserInfo
   */
  Login(input: UserInfo): Promise<void>;
  /**
   * Signup
   * @return AuthSignupResponse
   */
  Signup(): Promise<AuthSignupResponse>;
}

export interface ServicesHandler {
  Account: Account
  Auth: Auth
}
