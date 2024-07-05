import { connectToDB } from "@utils/database"
import Prompt from "@models/prompt";
import mongoose from "mongoose";

//GET(Read)
export const GET = async (request, {params}) => {
    try {
        await connectToDB();

        const prompt = await Prompt.findById(params.id).populate('creator');

        if(!prompt) return new Response("Prompt not found", {status: 404});

        return new Response(JSON.stringify(prompt), {status: 200})
    } catch (error) {
        return new Response("Failed to fetch prompts",{ status: 500})
    }
}

//PATCH
export const PATCH = async(request, {params}) => {
    const {prompt, tag} = await request.json();

    try {
        await connectToDB();
        const existingPrompt = await Prompt.findById(params.id);

        if(!existingPrompt) return new Response("Prompt not found", {status:404})

        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;

        await existingPrompt.save();

        return new Response(JSON.stringify(existingPrompt), {status:200})
        
    } catch (error) {
        return new Response("Failed to update prompt", {status:500})
    }
}

export const DELETE = async (request, { params }) => {
    try {
      await connectToDB();
  
      console.log(`Attempting to delete prompt with id: ${params.id}`);
  
      // Ensure the ID is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(params.id)) {
        console.error(`Invalid ObjectId: ${params.id}`);
        return new Response("Invalid ID", { status: 400 });
      }
  
      const result = await Prompt.findByIdAndDelete(params.id);
  
      if (!result) {
        console.error(`Prompt not found with id: ${params.id}`);
        return new Response("Prompt not found", { status: 404 });
      }
  
      console.log(`Prompt deleted successfully with id: ${params.id}`);
      return new Response("Prompt deleted successfully", { status: 200 });
    } catch (error) {
      console.error(`Error deleting prompt: ${error.message}`);
      return new Response("Error deleting prompt", { status: 500 });
    }
  };    