import request from '../utils/request'

export function getPostList (pageNumber) {
  return request({
    url: '/proxy/posts/' + '?page=' + pageNumber,
    method: 'get'
  })
}

export function getPostDetail (postId) {
  return request({
    url: '/proxy/posts/' + postId + '/',
    method: 'get'
  })
}

export function getPostReplies (postId) {
  return request({
    url: '/proxy/posts/' + postId + '/replies/',
    method: 'get'
  })
}

export function publishReply (postId, replyBody) {
  var data = {
    object_pk: postId,
    comment: replyBody
  }
  return request({
    url: '/proxy/replies/',
    method: 'post',
    data
  })
}

export function getPopularTags () {
  return request({
    url: '/proxy/tags/popular/',
    method: 'get'
  })
}

export function getPopularPosts () {
  return request({
    url: '/proxy/posts/popular/',
    method: 'get'
  })
}

export function publishPost (data) {
  return request({
    url: '/proxy/posts/',
    method: 'post',
    data
  })
}
export function editPost () {
  return request({
    url: '/proxy/posts/',
    method: 'put'
  })
}

export function getTagList () {
  return request({
    url: '/proxy/tags/popular/',
    method: 'get'
  })
}

export function getEmailList (params) {
  return request({
    url: '/proxy/users/email/',
    method: 'get',
    params: {
      ...params
    }
  })
}

export function getNoticeList (params) {
  return request({
    url: '/proxy/notifications/',
    method: 'get',
    params: {
      ...params
    }
  })
}
