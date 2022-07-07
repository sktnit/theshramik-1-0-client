import FileType from 'file-type'
export const checkFileType = async(file, type)=>{
    const allowedExt = ['jpeg', 'jpg', 'png']
    const sizeLimit = 5
    const fileSize = file.size
    let result = false
    return new Promise((resolve)=>{
        let reason = ''
        const maxPreviewSize = 5
        if(fileSize / 1000000 <= sizeLimit) {
            const reader = new FileReader()
            reader.readAsArrayBuffer(file)
            reader.onload = async (event) =>{
                const res = await FileType.fromBuffer(event.target.result)
                if(res) {
                    result = allowedExt.includes(res.ext)
                }
                reason = fileSize/1000000 >= maxPreviewSize ? 'Failed to Preview' : ''
                resolve({result: result, reason: !result ? 'File format is not supported' : reason})
            }
        } else {
            resolve({result: result, reason: !result ? 'Size Limit exceeded' : reason})
        }
    })
}