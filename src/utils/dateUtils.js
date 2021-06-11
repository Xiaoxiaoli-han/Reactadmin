/* 
    用于格式时间格式
*/

export default function formatDate(time){
    if(!time) return ''
    let date = new Date(time)
    return date.getFullYear() +'-'+ (date.getMonth()+1) +'-'+ (date.getDay()+1) +' '+
            (date.getHours()) +':'+ (date.getMinutes()) +':'+ (date.getSeconds())
}