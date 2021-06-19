import request from "../utils/request"

export const searchorg = (orgName) => {
  return request({
    method: 'GET',
    url: `/api/search/fuzzy-organization?organization=${orgName}`,
  })
}

export const singleorg = (id) => {
  return request({
    method: 'GET',
    url: `api/search/employee?organizationId=${id}`,
  })
}

export const getorgscore = (id) => {
  return request({
    method: 'GET',
    url: `/api/rank/organization?organizationId=${id}`,
  })
}