const {v2 } = require('cloudnairy');
v2.config(
    {
        cloud_name : process.env.ClOUD_NAME,
        api_Key:process.env.API_KEY,
        api_Secret :process.env.API_SECERT
    }
);
const uploadoncloudnairy = async function(localfilepath) {
    try{
        if(!localfilepath){
            return null
        }
       const response = await   v2.uploader.upload(localfilepath , {
            resource_type : "auto"
        });
        console.log("file uploaded succesfully");
        return response.url;
        

    }
    catch(error)
    {  
        fs.unlinkSync(localfilepath);
        console.log(error);
        return null;
    }
}

module.exports =  {uploadoncloudnairy };
