import request from '@/utils/request'
/**
 *
 * Setmeal management 
 *
 **/

//Setmeal Pagination Query 
export const getSetmealPage = (params: any) => {
    return request({
        url: '/setmeal/page',
        method: 'GET',
        params: params
    })
}

//Setmeal Start/Stop Sale 
export const enableOrDisableSetmeal = (params: any) => {
    return request({
        url: `/setmeal/status/${params.status}`,
        method: 'POST',
        params: {id: params.id}
    })
}

//Delete Setmeal 
export const deleteSetmeal = (ids: string) => {//1,2,3
    return request({
        url: '/setmeal',
        method: 'DELETE',
        params: {ids: ids}
    })
}


  
// Edit Setmeal 
export const editSetmeal = (params: any) => {
    return request({
        url: '/setmeal',
        method: 'put',
        data: { ...params }
    })
}

// Add Setmeal 
export const addSetmeal = (params: any) => {
    return request({
        url: '/setmeal',
        method: 'post',
        data: { ...params }
    })
}

// Query setmeal by id 
export const querySetmealById = (id: string | (string | null)[]) => {
    return request({
        url: `/setmeal/${id}`,
        method: 'get'
    })
}
