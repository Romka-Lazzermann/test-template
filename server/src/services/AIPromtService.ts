import axios from "axios";

export class AIPromtService {
    private model : string;
    private api_key : string;
    constructor(model: string = 'gemini-2.0-flash') {
        this.model = model;
        this.api_key = process.env?.GEMINI_API_KEY || "";
    }


    public async generateBlogContent(title: string | null){
        const prompt = `You are an AI assistant specialized in generating SEO-optimized, informative, and educational guide-style articles in clean HTML format for a blog website. This website is purely informational, without any product or service promotion or sales. The article must be structured and written as a helpful guide or editorial-style post. The topic is: ${title}
        The article must strictly comply with RSOC AFS guidelines: it should be formatted as a blog guide, avoid promotional/sales language, and must not resemble an e-commerce landing page.

        Organize the article as a well-structured blog-style guide, ensuring it reads like an informative editorial piece rather than a promotional or sales-oriented page.

        **Article Structure Requirements:**

        1.  **Engaging Introduction:** Begin with an introduction that explains the topic and its importance in the context of 2025.
        2.  **Practical Guidance Section:** Include a detailed section offering practical guidance on how to evaluate and select the appropriate type, category, or option related to the topic.
        3.  **Long-Term Considerations:** Incorporate a comprehensive section discussing long-term considerations such as maintenance requirements, recurring responsibilities, or associated ownership costs.
        4.  **Key Takeaways Summary:** Conclude with a summary that highlights key insights, essential tips, and helpful takeaways for readers.
        5.  **Informative Content:** The article must be rich in relevant information, use clear examples and comparisons where appropriate, and provide genuine value. Avoid any promotional or sales-focused language. The content must not resemble an e-commerce landing page in tone, structure, or intent.

        **Additional Requirements for Generated Content:**

        * **Minimum Article Length:** The content inside #description_start# and #description_end# must be a minimum of 7000 characters in HTML, including headings, sub-sections, lists, and examples. This is a strict requirement. If the generated HTML content falls short, explicitly state this, and then expand upon the sections (e.g., add more examples, details, sub-sections, or deepen existing points) until the 7000-character minimum is met.
        * **Internal Linking:** Include **Markdown URL links** within the main body of the HTML (inside #description_start# and #description_end#) to relevant external resources, studies, or informational sites, where appropriate. These links must be purely informational and enhance the guide's value, not promote any specific product or service.
        * **Tables:** Include at least one **table with relevant, up-to-date data** pertinent to the article's topic within the #description_start# and #description_end# section.
        * **FAQ:** Add an **FAQ (Frequently Asked Questions) section** with 3-5 questions and answers related to the article's topic towards the end of the main content (#description_start# and #description_end#).
        * **Disclaimer:** If the topic is medical, financial, or high-risk, a disclaimer is mandatory (e.g., 'This information is for informational purposes only' or 'Prices are accurate as of 2025'). This should be placed within the #description_start# and #description_end# block.
        * **Sources:** Cite 2-5 **authoritative sources** at the end of the main content block (#description_start# and #description_end#). Do not fabricate sources; use genuinely existing ones.

        **Response Format (Strict Adherence Required):**

        #title_start#
        <h1>[Generate a new, unique, SEO-optimized, informative, and neutral title for the blog article that avoids any sales language (e.g., “buy”, “deal”, “offer”, “limited”), sounds like a guide/overview/explanation, and is suitable for a content blog (not an e-commerce site). Examples: “Guide to [Topic] in 2025”, “Understanding [Topic]”, “All About [Topic]”, “What Is [Topic]?”, “Exploring [Topic]”, “How [Topic] Works”, “Basics of [Topic]”, “Key Facts About [Topic]”, “Intro to [Topic]”, “Getting Started with [Topic]”]</h1>
        #title_end#

        #description_start_text_start#
        [HTML of the engaging introduction (first paragraph of the article). Use clean semantic HTML. Only output the final HTML code, no extra text. Up to 5000 characters, but typically will be shorter.]
        #description_start_text_end#

        #description_start#
        [Clean semantic HTML of the detailed article body, including the practical guidance, long-term considerations, FAQ, disclaimer (if applicable), and sources. This section MUST be a minimum of 7000 characters in HTML. Only output the final HTML code, no extra text.]
        #description_end#

        #summary_start#
        [Clean semantic HTML of the summary section (key insights, essential tips, helpful takeaways). Only output the final HTML code, no extra text.]
        #summary_end#

        #keywords_start#
        KeyWords1, KeyWords2, KeyWords3 (Write 3 relevant keywords for the article separated by commas)
        #keywords_end#


        The answer must strictly follow the given template. Do not add any other variables or format. Use only the specified delimiters. The content inside #description_start# and #description_end# must strictly adhere to the 7000-character minimum in HTML.
        `
        const url  = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.api_key}`
        const data = {
            contents : {
                parts: {
                    text: prompt
                }
            }
        }
        const response = await this.request(url, data);
        const text = response['candidates'][0]['content']['parts'][0]['text'] || null
        const finishReason = response['candidates'][0]['finishReason'] || null
        const promptTokenCount =  response['usageMetadata']['promptTokenCount'] || 0
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
        try{
            const response = await axios.post(url, JSON.stringify(payload),
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
        // console.log("Show me the res data", response?.data)
        return response?.data;
        }
        catch(e){
            console.log("Request error", e.message)
        }

    }
}

const Gemini = new AIPromtService();
export default Gemini;