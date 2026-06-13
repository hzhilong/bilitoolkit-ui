import type { UserInfo, UserInfoWithCookie } from '@ybgnb/bili-api'

export const testUser = {
  mid: 1234567890,
  name: '测试用户测试用户测试用户测试用户测试用户',
  face: 'http://i0.hdslb.com/bfs/face/member/noface.jpg',
  sex: '男',
  level: 6,
  sign: '签名签名签名签名签名签名签名签名签名',
  moral: 0,
  silence: 0,
  following: 666,
  follower: 888,
  coins: 10000,
  rank: 1000,
  vip: {
    type: 0,
    status: 0,
  },
} satisfies UserInfo as UserInfoWithCookie
