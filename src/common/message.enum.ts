/**
 * messages support placeholder,
 * like:
 *     $0, $1, ..., and so on,
 * it will be replaced with the real value that is passed to the params.
 * Notice:
 *     placeholder starts with 0!
 */
export enum Message {
  // todo: internationalize
  NOT_FOUND = 'Page not found',
  UNKNOWN_ERROR = 'Unknown error',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Forbidden',
  BAD_REQUEST = 'Bad request',
  INTERNAL_SERVER_ERROR = '请求失败，请稍后重试',
  UNSUPPORTED_OPERATION = '操作不支持',
  PARAM_INVALID = '参数“$0”无效',
  PARAM_VALUE_INVALID = '参数“$0: $1”无效',
  PARAM_MISSING = '缺少参数: $0',
  PARAM_MUST_BE_ARRAY = '参数“$0”必须为数组',
  DB_QUERY_ERROR = '请求失败，请稍后重试',
  UNSUPPORTED_QUERY_ORDERS = '不支持的排序参数'
}
