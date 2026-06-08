import {clerkClient} from '@clerk/express'
export const getUserCreations=async (req,res)=>{
    try {
        const {userId}= req.auth()
    } catch (error) {
        res.json({success:"false", message:error.message})
    }
}