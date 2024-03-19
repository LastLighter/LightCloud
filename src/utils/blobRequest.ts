

//响应拦截器
BlobRequest.interceptors.response.use((response) => {
   
},(error) => {
    ElMessage({
        type: 'error',
        message: '服务器访问错误，请检查网络连接'
    })
})

//导出自定义的axios
export default blobRequest;