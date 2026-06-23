const { insertFeelBack } = require("../models/feedback.model")

const insertfeelBack = async (req,res) =>{
    try{
        let feelback = req.body;
        let resutl = await insertFeelBack(feelback);
        if(!resutl){
            return res.json({
                success:false,
                message:"Nhan day du thong tin"
            });
        }
        res.json({success:true,message:"Gui thanh cong"});
    }catch(error){
        res.json({message:"Loi server"});
    }
}
module.exports={
    insertfeelBack
}