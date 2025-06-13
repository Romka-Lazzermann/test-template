import axios from "axios";
import { inject, injectable } from 'tsyringe'
import { getGenerateBlogContentPrompt, getGenerateLinksContentPrompt, getTraslateTheBlog } from "../helpers/prompts";
import { MODEL_TOKEN } from "../helpers/validate";
@injectable()
export class AIPromtService {
    private model: string;
    private api_key: string;
    constructor(@inject(MODEL_TOKEN) model: string) {
        this.model = model;
        this.api_key = process.env?.GEMINI_API_KEY || "";
    }


    public async generateBlogContent(title: string | null) {
        const prompt = getGenerateBlogContentPrompt(title || '')
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.api_key}`
        const data = {
            contents: {
                parts: {
                    text: prompt
                }
            }
        }
        const response = await this.request(url, data);
        const text = response['candidates'][0]['content']['parts'][0]['text'] || null
        const finishReason = response['candidates'][0]['finishReason'] || null
        const promptTokenCount = response['usageMetadata']['promptTokenCount'] || 0
        const candidatesTokenCount = response['usageMetadata']['candidatesTokenCount'] || 0
        const totalTokenCount = response['usageMetadata']['totalTokenCount'] || 0
        return {
            text,
            finishReason,
            tokens: {
                promptTokenCount,
                candidatesTokenCount,
                totalTokenCount,
            }
        }

    }

    public async generateLinkContent(title: string | null) {
        const prompt = getGenerateLinksContentPrompt(title || '')
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.api_key}`
        const data = {
            contents: {
                parts: {
                    text: prompt
                }
            }
        }
        const response = await this.request(url, data);
        const text = response['candidates'][0]['content']['parts'][0]['text'] || null
        const finishReason = response['candidates'][0]['finishReason'] || null
        const promptTokenCount = response['usageMetadata']['promptTokenCount'] || 0
        const candidatesTokenCount = response['usageMetadata']['candidatesTokenCount'] || 0
        const totalTokenCount = response['usageMetadata']['totalTokenCount'] || 0
        return {
            text,
            finishReason,
            tokens: {
                promptTokenCount,
                candidatesTokenCount,
                totalTokenCount,
            }
        }
    }

    public async translateLinkContent(payload: any) {
        const prompt = getTraslateTheBlog(payload)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.api_key}`
        const data = {
            contents: {
                parts: {
                    text: prompt
                }
            }
        }
        const response = await this.request(url, data);
        const text = response['candidates'][0]['content']['parts'][0]['text'] || null
        const finishReason = response['candidates'][0]['finishReason'] || null
        const promptTokenCount = response['usageMetadata']['promptTokenCount'] || 0
        const candidatesTokenCount = response['usageMetadata']['candidatesTokenCount'] || 0
        const totalTokenCount = response['usageMetadata']['totalTokenCount'] || 0
        return {
            text,
            finishReason,
            tokens: {
                promptTokenCount,
                candidatesTokenCount,
                totalTokenCount,
            }
        }
    }

    private async request(url: string, payload: any) {
        try {
            const response = await axios.post(url, JSON.stringify(payload),
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            return response?.data;
        }
        catch (e) {
            console.log("Request error", e.message)
        }

    }
}