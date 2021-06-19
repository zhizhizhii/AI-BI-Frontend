import request from "../utils/request"

export const searchperson = (givenName,familyName) => {
  return request({
    method: 'GET',
    url: `/api/search/person?givenName=${givenName}&familyName=${familyName}`,
  })
}

export const singleperson = (id) => {
  return request({
    method: 'GET',
    url: `/api/search/employer?personId=${id}`,
  })
}

export const getpersonscore = (id) => {
  return request({
    method: 'GET',
    url: `/api/rank/person?personId=${id}`,
  })
}

